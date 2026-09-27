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
        shipping_rate: { type: String, default: '' },
        shipping_amount: { type: Number, default: 0 }  
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
        default: 'Pending'
    },
    shipping_address: {
        line1: { type: String, default: '' },
        line2: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        postal_code: { type: String, default: '' },
        country: { type: String, default: '' }
    },

    customer_phone: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const orderModel = mongoose.model('Order', orderSchema);

module.exports = orderModel;
