const stripe = require('../../config/stripe');
const userModel = require('../../models/userModel');

const paymentController = async (req, res) => {
    try {
        const { cartItems, address, phone } = req.body;  
        const user = await userModel.findOne({ _id: req.userId });

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
            customer_email: user.email,
            metadata: {
                userId: req.user._id.toString(),
                name: user.name,
                phone:  user.phone,
                address: user.address,
            },
            line_items: cartItems.map((item) => {
                return {
                    price_data: {
                        currency: 'vnd',
                        product_data: {
                            name: item.productId.productName,
                            images: item.productId.productImage,
                            metadata: {
                                productId: item.productId._id
                            }
                        },
                        unit_amount: item.productId.sellingPrice
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.FONTEND_URL}/success`,
            cancel_url: `${process.env.FONTEND_URL}/cancel`
        };

        const session = await stripe.checkout.sessions.create(params);
        console.log(session);
        res.status(200).json(session);
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
};

module.exports = {
    paymentController
};
