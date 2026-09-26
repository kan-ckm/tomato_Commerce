const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require("../../models/userModel");

async function userSignInController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error('Please enter email');
    }
    if (!password){
       throw new Error('Please enter the password');
      }

    const user = await userModel.findOne({ email });

    if (!user) 
      {
        throw new Error('User not found');
      }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      {
         throw new Error("Incorrect password or email");
      }
    user.lastLogin = new Date();
    await user.save();
    const tokenData = {
      _id: user._id,
      email: user.email,
      role: user.role
    };

    
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
      expiresIn: 60 * 60 * 8,
    });
    
    const cookieName = user.role === "ADMIN" ? "admin_token" : "user_token";
    const tokenOptions = {
      httpOnly: true,
      secure: true, 
    };

    res.cookie(cookieName, token, tokenOptions).status(200).json({
      message: "Login successfully",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      success: true,
      error: false
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false
    });
  }
}

module.exports = userSignInController;
