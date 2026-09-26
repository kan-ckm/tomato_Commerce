const addToCartModel = require("../../models/cartProductModel");

const addToCartViewProduct = async (req, res) => {
  try {
    const currentUser = req.userId;
    const allProducts = await addToCartModel.find({
        userId: currentUser,

    }).populate("productId")
    res.json({
        data: allProducts,
        success:true,
        error: false,
    })

}catch (err) {
    res.json({
        message : err.message|| err,
        error: true,
        success: false,

    })
}
}

module.exports = addToCartViewProduct;