const mongoose = require('mongoose');
const stripe = require('../../config/stripe');
const OrderModel = require('../../models/orderProductModel');
const Product = require('../../models/productModel');
const addToCartModel = require("../../models/cartProductModel");

const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

async function getLineItems(lineItems) {
    let ProductItems = [];
    if (lineItems?.data?.length) {
        for (const item of lineItems.data) {
            try {
                const product = await stripe.products.retrieve(item.price.product);
                const productId = product.metadata?.productId || item.price.product;
                const productData = {
                    productId: productId,
                    name: product.name,
                    price: item.price.unit_amount,
                    quantity: item.quantity,
                    image: product.images
                };
                ProductItems.push(productData);
            } catch (err) {
                console.error("Error retrieving product:", err.message || err);
            }
        }
        return ProductItems;
    }
    return ProductItems;
}

/**
 * Xử lý hoàn tất đơn hàng và trừ tồn kho an toàn trước Race Condition
 */
async function processOrderCheckoutSession(session, productDetails) {
    const paymentId = session.payment_intent || session.id;

    // 1. Idempotency Check: Ngăn chặn xử lý lặp lại nếu Stripe gửi webhook nhiều lần
    if (paymentId) {
        const existingOrder = await OrderModel.findOne({ 'paymentDetails.paymentId': paymentId });
        if (existingOrder) {
            console.log(`[WEBHOOK] Giao dịch ${paymentId} đã được xử lý trước đó. Bỏ qua duplicate webhook.`);
            return { success: true, order: existingOrder, alreadyProcessed: true };
        }
    }

    const customerName = session.customer_details?.name || session.metadata?.name || '';
    const shippingAddress = session.customer_details?.address || {};
    const customerPhone = session.customer_details?.phone || session.metadata?.phone || '';

    // 2. ATOMIC DEDUCTION (Trừ kho nguyên tử - Ngăn chặn triệt để Race Condition)
    const deductedItems = [];
    let isOutOfStock = false;
    let outOfStockItem = null;

    for (const item of productDetails) {
        // Điều kiện nguyên tử countInStock >= quantity đảm bảo không bị overselling
        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: item.productId,
                countInStock: { $gte: item.quantity }
            },
            {
                $inc: {
                    countInStock: -item.quantity,
                    sales: item.quantity
                }
            },
            { new: true }
        );

        if (!updatedProduct) {
            // Hết hàng / Có người khác vừa mua món hàng cuối cùng!
            isOutOfStock = true;
            outOfStockItem = item;
            break;
        } else {
            deductedItems.push(item);
        }
    }

    // 3. XỬ LÝ KHI XẢY RA RACE CONDITION / HẾT HÀNG
    if (isOutOfStock) {
        console.warn(`[RACE CONDITION] Sản phẩm không đủ tồn kho: ${outOfStockItem?.name || outOfStockItem?.productId}`);

        // Rollback các sản phẩm đã trừ trước đó trong cùng đơn hàng
        for (const rolledBack of deductedItems) {
            await Product.findByIdAndUpdate(
                rolledBack.productId,
                {
                    $inc: {
                        countInStock: rolledBack.quantity,
                        sales: -rolledBack.quantity
                    }
                }
            );
        }

        // Tự động hoàn tiền Stripe cho khách
        let refundSuccess = false;
        if (session.payment_intent && stripe?.refunds?.create) {
            try {
                await stripe.refunds.create({
                    payment_intent: session.payment_intent,
                    reason: 'requested_by_customer'
                });
                refundSuccess = true;
                console.log(`[AUTO REFUND] Đã hoàn tiền thành công cho payment ${session.payment_intent}`);
            } catch (refundErr) {
                console.error("[AUTO REFUND ERROR] Lỗi khi tạo refund qua Stripe:", refundErr.message || refundErr);
            }
        }

        // Ghi nhận đơn hàng với trạng thái Cancelled để tra soát
        const cancelledOrder = new OrderModel({
            productDetails: productDetails,
            email: session.customer_details?.email || session.customer_email || 'N/A',
            name: customerName || 'Khách hàng',
            userId: session.metadata?.userId || 'guest',
            paymentDetails: {
                paymentId: paymentId,
                payment_method_type: session.payment_method_types || ['card'],
                payment_status: refundSuccess ? 'Refunded (Hết hàng - Đã hoàn tiền)' : 'Failed (Hết hàng - Chờ hoàn tiền)',
            },
            shipping_options: session.shipping_options || [],
            totalAmount: session.amount_total || 0,
            shipping_address: {
                line1: shippingAddress.line1 || 'N/A',
                line2: shippingAddress.line2 || '',
                city: shippingAddress.city || 'N/A',
                state: shippingAddress.state || 'N/A',
                postal_code: shippingAddress.postal_code || 'N/A',
                country: shippingAddress.country || 'VN'
            },
            customer_phone: customerPhone || 'N/A',
            status: 'Cancelled'
        });

        const savedCancelledOrder = await cancelledOrder.save();
        return { success: false, reason: 'OUT_OF_STOCK', order: savedCancelledOrder, outOfStockItem };
    }

    // 4. KHI ĐỦ TỒN KHO: LƯU ĐƠN HÀNG THÀNH CÔNG
    const orderDetails = {
        productDetails: productDetails,
        email: session.customer_details?.email || session.customer_email || 'N/A',
        name: customerName || 'Khách hàng',
        userId: session.metadata?.userId || 'guest',
        paymentDetails: {
            paymentId: paymentId,
            payment_method_type: session.payment_method_types || ['card'],
            payment_status: session.payment_status || 'paid',
        },
        shipping_options: session.shipping_options || [],
        totalAmount: session.amount_total || 0,
        shipping_address: {
            line1: shippingAddress.line1 || 'N/A',
            line2: shippingAddress.line2 || '',
            city: shippingAddress.city || 'N/A',
            state: shippingAddress.state || 'N/A',
            postal_code: shippingAddress.postal_code || 'N/A',
            country: shippingAddress.country || 'VN'
        },
        customer_phone: customerPhone || 'N/A',
        status: 'Pending'
    };

    const order = new OrderModel(orderDetails);
    const saveOrder = await order.save();

    if (saveOrder?._id && session.metadata?.userId && mongoose.Types.ObjectId.isValid(session.metadata.userId)) {
        await addToCartModel.deleteMany({ userId: session.metadata.userId });
    }

    return { success: true, order: saveOrder };
}

const webhooks = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;

            try {
                const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
                const productDetails = await getLineItems(lineItems);

                await processOrderCheckoutSession(session, productDetails);
            } catch (err) {
                console.error('Error processing checkout webhook order:', err);
                return res.status(500).json({ error: 'Error processing order' });
            }

            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200).send();
};

module.exports = {
    webhooks,
    processOrderCheckoutSession
};
