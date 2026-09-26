const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');

exports.verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    if (
      user.resetPasswordCode !== code ||
      new Date(user.resetPasswordExpires) < Date.now() 
    ) {
      throw new Error('Code is invalid or expired.');
    }

    const token = jwt.sign({ email }, process.env.TOKEN_SECRET_KEY, { expiresIn: '15m' });

    return res.status(200).json({
      message: "Valid verification code.",
      success: true,
      error: false,
      token,
      expiresAt: user.resetPasswordExpires, 
    });

  } catch (err) {
    return res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};
