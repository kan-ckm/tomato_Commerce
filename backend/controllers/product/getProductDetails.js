const productModel = require("../../models/productModel");
const reviewModel = require("../../models/reviewModel");

const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;


    const product = await productModel.findById(productId);
    if (!product) {
       throw new Error("Product not found");
    }

    const reviews = await reviewModel.find({ productId })
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

 
    const avgRating = reviews.length
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;


    res.json({
      data: {
        ...product._doc, 
        reviews,
        averageRating: avgRating.toFixed(1)
      },
      message: "OK",
      success: true,
      error: false
    });

  } catch (err) {
    res.status(400).json({
      message: err?.message || err,
      error: true,
      success: false
    });
  }
};

module.exports = getProductDetails;
