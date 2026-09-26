const mongoose = require('mongoose');

const addToCartSchema = new mongoose.Schema({    
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', 
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number
  }
}, {
  timestamps: true
});

const addToCartModel = mongoose.model("AddToCart", addToCartSchema);

module.exports = addToCartModel;
