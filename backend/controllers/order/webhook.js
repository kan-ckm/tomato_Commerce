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
                const productId = product.metadata.productId;
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

            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
            const productDetails = await getLineItems(lineItems);
            const  customerName = session.customer_details.name
            const shippingAddress = session.customer_details.address;
            const customerPhone = session.customer_details.phone;

          
            for (const item of productDetails) {
                const product = await Product.findById(item.productId);
                if (product) {
                    const updatedStock = Math.max(0, product.countInStock - item.quantity);
                    if (updatedStock !== product.countInStock) {
                        product.countInStock = updatedStock;
                        product.sales += item.quantity;
                        await product.save();
                    }
                } else {
                    console.error(`Product not found with ID: ${item.productId}`);
                }
            }

            const orderDetails = {
                productDetails: productDetails,
                email: session.customer_details.email,
                name:customerName,
                userId: session.metadata.userId,
                paymentDetails: {
                    paymentId: session.payment_intent,
                    payment_method_type: session.payment_method_types,
                    payment_status: session.payment_status,
                },
                shipping_options: session.shipping_options,
                totalAmount: session.amount_total,
                shipping_address: shippingAddress,
                customer_phone: customerPhone,
                    status: 'Pending'
            };
 
            console.log('Shipping Options:', session.shipping_options);
            try {
                const order = new OrderModel(orderDetails);
                const saveOrder = await order.save();

                if (saveOrder?._id) {
                    await addToCartModel.deleteMany({ userId: session.metadata.userId });
                }
            } catch (err) {
                console.error('Error saving order:', err);
                return res.status(500).json({ error: 'Error saving order' });
            }

            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}.`);
    }

    res.status(200).send();
};

module.exports = {
    webhooks
};
