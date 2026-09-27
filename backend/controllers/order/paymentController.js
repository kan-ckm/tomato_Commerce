const stripe = require('../../config/stripe');
const userModel = require('../../models/userModel');
const Product = require('../../models/productModel');

const paymentController = async (req, res) => {
    try {
        const { cartItems, address, phone } = req.body;  

        if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({
                message: "Giỏ hàng của bạn đang trống",
                error: true,
                success: false
            });
        }

        // 1. Kiểm tra tồn kho trước khi tạo phiên thanh toán Stripe
        for (const item of cartItems) {
            const prodId = item?.productId?._id || item?.productId;
            const product = await Product.findById(prodId);

            if (!product) {
                return res.status(400).json({
                    message: "Có sản phẩm không tồn tại trong hệ thống",
                    error: true,
                    success: false
                });
            }

            if (product.countInStock <= 0) {
                return res.status(400).json({
                    message: `Sản phẩm "${product.productName}" đã hết hàng!`,
                    error: true,
                    success: false
                });
            }

            if (product.countInStock < item.quantity) {
                return res.status(400).json({
                    message: `Sản phẩm "${product.productName}" chỉ còn lại ${product.countInStock} cái trong kho (bạn đang đặt ${item.quantity})`,
                    error: true,
                    success: false
                });
            }
        }

        const user = await userModel.findOne({ _id: req.userId });
        const userIdStr = (user?._id || req.userId || req.user?._id || '').toString();
        const userName = user?.name || req.user?.name || '';
        const userPhone = phone || user?.phone || '';
        const userAddress = address || user?.address || '';

        const params = {
            submit_type: 'pay',
            mode: "payment",
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_address_collection: {
                allowed_countries: ['US', 'VN'],
            },
            phone_number_collection: {
                enabled: true,
            },
            shipping_options: [
                {
                    shipping_rate: 'shr_1RIpLJPRfyy5ngw5qLJUGJXH'
                }
            ],
            customer_email: user?.email,
            metadata: {
                userId: userIdStr,
                name: String(userName),
                phone: String(userPhone),
                address: String(userAddress),
            },
            line_items: cartItems.map((item) => {
                const prod = item.productId || {};
                const prodImages = Array.isArray(prod.productImage)
                    ? prod.productImage.filter(img => typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://')))
                    : [];

                return {
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: prod.productName || 'Sản phẩm',
                            images: prodImages.length > 0 ? [prodImages[0]] : [],
                            metadata: {
                                productId: (prod._id || item.productId).toString()
                            }
                        },
                        unit_amount: prod.sellingPrice || prod.price || 0
                    },
                    adjustable_quantity: {
                        enabled: false // Ngăn không cho chỉnh sửa số lượng trên trang Stripe
                    },
                    quantity: item.quantity
                };
            }),
            success_url: `${process.env.FONTEND_URL}/success`,
            cancel_url: `${process.env.FONTEND_URL}/cancel`
        };

        const session = await stripe.checkout.sessions.create(params);
        res.status(200).json(session);
    } catch (err) {
        res.status(500).json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = {
    paymentController
};
