const Product = require('../../models/productModel');

const getProductDetailsId = async (req, res) => {
  try {
    const productId = req.params.id;
    
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error("Error fetching product details:", err);
    res.status(400).json({
      message : err.message || err,
      error : true,
      success: false

  })
  }
};

module.exports = {
  getProductDetailsId,
};
