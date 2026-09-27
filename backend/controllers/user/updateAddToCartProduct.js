const addToCartModel = require("../../models/cartProductModel")
const productModel = require("../../models/productModel")

const updateAddToCartProduct = async(req,res)=>{
    try{
        const currentUserId = req.userId 
        const addToCartProductId = req?.body?._id
        const qty = Number(req.body.quantity)

        if (qty && qty < 1) {
            return res.json({
                message: "Số lượng sản phẩm tối thiểu là 1",
                error: true,
                success: false
            });
        }

        const cartItem = await addToCartModel.findOne({ _id: addToCartProductId, userId: currentUserId });
        if (!cartItem) {
            return res.json({
                message: "Không tìm thấy sản phẩm trong giỏ hàng",
                error: true,
                success: false
            });
        }

        if (qty) {
            const product = await productModel.findById(cartItem.productId);
            if (product && qty > product.countInStock) {
                return res.json({
                    message: `Sản phẩm "${product.productName}" chỉ còn lại ${product.countInStock} cái trong kho`,
                    error: true,
                    success: false
                });
            }
        }

        const updateProduct = await addToCartModel.updateOne({_id : addToCartProductId, userId: currentUserId},{
            ...(qty && {quantity : qty})
        })

        res.json({
            message : "Product Updated",
            data : updateProduct,
            error : false,
            success : true
        })

    }catch(err){
        res.json({
            message : err?.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = updateAddToCartProduct