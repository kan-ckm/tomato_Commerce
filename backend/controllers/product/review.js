const Review = require("../../models/reviewModel");



const reviewController = async (req, res) => {

try {
  const { productId, rating, comment } = req.body;

    const existingReview = await Review.findOne({
      userId: req.userId,
      productId,
    });

    if (existingReview) {
      throw new Error("You already reviewed this product.")
    }

    const newReview = new Review({
      userId: req.userId,
      productId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({
       message: "Review created successfully",
       success: true,
        error: false,
       review: newReview 
      });

} catch (err) {
  res.status(400).json({
    message : err?.message || err,
    error : true,
    success : false
})
} 
}

module.exports = reviewController;