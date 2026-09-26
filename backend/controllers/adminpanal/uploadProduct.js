const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function uploadProductController(req, res) {
    try {
        const sessionUserId = req.userId;

        if (!uploadProductPermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            const backendURL = process.env.BACKEND_URL;
            imagePaths = req.files.map(file => `${backendURL}/uploads/${file.filename}`); 
        }

        const uploadProduct = new productModel({
            ...req.body,
            productImage: imagePaths, 
        });

        const saveProduct = await uploadProduct.save();

        res.status(200).json({
            message: "Product uploaded successfully",
            error: false,
            success: true,
            data: saveProduct,
        });

    } catch (err) {
        res.status(400).json({
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
}   

module.exports = uploadProductController;
