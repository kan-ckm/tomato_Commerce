const jwt = require('jsonwebtoken');

async function adminAuth(req, res, next) {
	try {
		const token = req.cookies?.admin_token;

		if (!token) {
			return res.status(401).json({
				message: "Please login as admin.",
				error: true,
				success: false,
			});
		}

		jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, decoded) => {
			if (err || decoded.role !== "ADMIN") {
				return res.status(403).json({
					message: "Unauthorized: Admin only.",
					error: true,
					success: false,
				});
			}

			req.userId = decoded?._id;
			req.user = decoded;
			next();
		});
	} catch (err) {
		res.status(500).json({
			message: err.message || "Admin Auth Error",
			error: true,
			success: false,
		});
	}
}

module.exports = adminAuth;
