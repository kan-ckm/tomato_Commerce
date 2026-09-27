const fs = require('fs');
const uploadProductPermission = require("../../helpers/permission");
const productModel = require("../../models/productModel");
const { uploadToCloudinary } = require("../../helpers/uploadCloudinary");

async function uploadProductController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Kiểm tra quyền upload sản phẩm
        if (!uploadProductPermission(sessionUserId)) {
            throw new Error("Permission denied");
        }

        // Xử lý upload danh sách ảnh lên Cloudinary
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(async (file) => {
                let buffer = file.buffer;
                if (!buffer && file.path) {
                    buffer = fs.readFileSync(file.path);
                    try { fs.unlinkSync(file.path); } catch (e) {}
                }
                return uploadToCloudinary(buffer, file.originalname, 'Kanproduct');
            });

            const uploadedCloudUrls = await Promise.all(uploadPromises);
            imagePaths = [...imagePaths, ...uploadedCloudUrls];
        }

        // Hỗ trợ trường hợp client truyền kèm URL ảnh sẵn có trong req.body
        if (req.body.productImage) {
            const raw = req.body.productImage;
            const existingUrls = Array.isArray(raw) ? raw : [raw];
            imagePaths = [...imagePaths, ...existingUrls.filter(Boolean)];
        }

        // Tạo sản phẩm mới
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
