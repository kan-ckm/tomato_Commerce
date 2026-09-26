const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../models/userModel");

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const email = decoded.email;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }
const passwordStrengthPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordStrengthPattern.test(newPassword)) {
         throw new Error('New password must be at least 8 characters long and contain both letters and numbers.')
      }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ 
      message: "Password updated successfully",
      success: true,
      error: false
    });

  } catch (err) {
		res.json({
			message: err.message || err,
			error: true,
			success: false,
		});
  }
};
