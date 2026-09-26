async function uploadImageController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided",
                error: true,
                success: false,
            });
        }

        const backendURL = process.env.BACKEND_URL || "http://localhost:8080";
        const imageUrl = `${backendURL}/uploads/${req.file.filename}`;

        res.status(200).json({
            message: "Image uploaded successfully",
            error: false,
            success: true,
            url: imageUrl,
            data: { url: imageUrl }
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
