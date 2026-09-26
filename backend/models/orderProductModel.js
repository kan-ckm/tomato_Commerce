const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productDetails: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        image: [String]
    }],
    name:String,
    email: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    paymentDetails: {
        paymentId: {
            type: String,
            required: true
        },
        payment_method_type: {
            type: [String],
            required: true
        },
        payment_status: {
            type: String,
            required: true
        }
    },
    shipping_options: [{
        shipping_rate: { type: String, required: true },
        shipping_amount: { type: Number, required: true }  
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending'
},
    shipping_address: {
        line1: { type: String, required: true },
        line2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true }
    },

    customer_phone: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
