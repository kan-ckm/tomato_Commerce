const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

async function userAuth(req, res, next) {
    try {
        const token = req.cookies?.user_token;

        if (!token) {
            return res.status(401).json({
                message: "Please login as user.",
                error: true,
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
        const user = await userModel.findById(decoded._id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists.",
                error: true,
                success: false,
            });
        }

        req.userId = user._id;
        req.user = user; 
        next();

    } catch (err) {
        res.status(500).json({
            message: err.message || "User Auth Error",
            error: true,
            success: false,
        });
    }
}

module.exports = userAuth;
