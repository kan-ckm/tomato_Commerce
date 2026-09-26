const rimraf = require("rimraf").sync;
const productModel = require("../../models/productModel"); 
const path = require("path");

const deleteProductController = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findById(productId);

        if (product && Array.isArray(product.productImage)) {
            product.productImage.forEach((imagePath) => {
                const filename = path.basename(imagePath);
                const fullPath = path.join(__dirname, "../../uploads", filename);
                rimraf(fullPath); 
            });
        }


        await productModel.findByIdAndDelete(productId);

     
        res.json({
            message: "Product delete successfully", 
            data: productId,
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


module.exports = deleteProductController;
