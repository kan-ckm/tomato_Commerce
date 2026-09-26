const mongoose = require("mongoose");
const Review = require("../../models/reviewModel");

const getProductReviewsController = async (req, res) => {
  try {
    const { id: productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid productId format" });
    }

    const reviews = await Review.find({ productId })
      .populate("userId", "name profilePic")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = getProductReviewsController;
