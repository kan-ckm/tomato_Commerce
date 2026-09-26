const crypto = require("crypto");
const User = require("../../models/userModel");
const nodemailer = require("nodemailer");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
            throw new Error('User not found');
    }

    
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    const expireTime = Date.now() + 1000 * 60 * 1; 

    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = expireTime;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Verification Code",
      html: `<p>Your verification code is: <b>${resetCode}</b></p><p>This code will expire in 1 minutes.</p>`,
    });

    res.status(200).json({
       message: "Verification code sent to your email.",
       success: true,
        error: false,
   expiresAt: new Date(expireTime).toISOString(),

    });
  } catch (err) {
    res.json({
      message : err.message || err  ,
      error : true,
      success : false,
  })
  }
};
