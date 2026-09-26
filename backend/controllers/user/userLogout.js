async function userLogout(req, res) {
	try {
		res.clearCookie("user_token"); 
		res.json({
			message: "User logged out successfully",
			error: false,
			success: true,
			data: []
		});
	} catch (err) {
		res.json({
			message: err.message || err,
			error: true,
			success: false,
		});
	}
}
async function adminLogout(req, res) {
	try {
		res.clearCookie("admin_token"); 
		res.json({
			message: "User logged out successfully",
			error: false,
			success: true,
			data: []
		});
	} catch (err) {
		res.json({
			message: err.message || err,
			error: true,
			success: false,
		});
	}
}


module.exports = {userLogout,
	adminLogout
}