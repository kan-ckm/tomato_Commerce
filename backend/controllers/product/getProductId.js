const Product = require("../../models/productModel");

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new Error("Product not found")
    }
    res.status(200).json({ success: true, data: product });
  }  catch (err) {
		res.json({
			message: err.message || err,
			error: true,
			success: false,
		});
  }
}

module.exports = getSingleProduct;
