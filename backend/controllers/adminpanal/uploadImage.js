const fs = require('fs');
const { uploadToCloudinary } = require('../../helpers/uploadCloudinary');

async function uploadImageController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided",
                error: true,
                success: false,
            });
        }

        let buffer = req.file.buffer;
        if (!buffer && req.file.path) {
            buffer = fs.readFileSync(req.file.path);
            try { fs.unlinkSync(req.file.path); } catch (e) {}
        }

        const secureUrl = await uploadToCloudinary(buffer, req.file.originalname, 'Kanproduct');

        res.status(200).json({
            message: "Image uploaded successfully to Cloudinary",
            error: false,
            success: true,
            url: secureUrl,
            data: { url: secureUrl }
        });
    } catch (err) {
        res.status(400).json({
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = uploadImageController;
