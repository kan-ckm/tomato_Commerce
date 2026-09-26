const addToCartModel = require("../../models/cartProductModel")
const countAddToCartProduct = async (req, res) => {
    try {
     const userId=req.userId
     const count = await addToCartModel.countDocuments({
        userId:userId
    }) 
    res.json({
        data: {
            count:count
        },
        message: "Count add to cart product",
        success: true,
        error: false,
    })
    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}
module.exports = countAddToCartProduct;