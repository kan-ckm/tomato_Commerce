const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    productName: {
      type: String,
      required: true
    },
    brandName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    productImage: {
      type: [String], 
      default: []
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    sellingPrice: {
      type: Number,
      required: true
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0
    },
    sales: { 
      type: Number,
      default: 0 
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
