const addToCartModel = require("../../models/cartProductModel");
const productModel = require("../../models/productModel");

const addToCartController = async (req, res) => {
    try{
        const {productId} = req?.body;
        const currentuserId = req?.userId;

        const product = await productModel.findById(productId);
        if (!product) {
            throw new Error("Sản phẩm không tồn tại");
        }
        if (product.countInStock <= 0) {
            throw new Error("Sản phẩm đã hết hàng");
        }

        const isProductAvailable = await addToCartModel.findOne({ productId: productId, userId: currentuserId,});
        if(isProductAvailable){
             throw new Error("Already exits in Add to cart")

        }
        const payload={
            productId: productId,
            quantity: 1,
            userId: currentuserId
        }
        const newAddToCart = new addToCartModel(payload)
        const saveProduct =await newAddToCart.save();
      return res.json({
            message: "Product added to cart successfully",
            success: true,
            error: false,
            data: saveProduct,
        })
    }
catch (err) {
    res.json({
        message : err.message|| err,
        error: true,
        success: false,

    })
}
}
module.exports = addToCartController;