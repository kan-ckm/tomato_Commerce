const User = require("../../models/userModel");
const bcrypt = require('bcryptjs');  

const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, profilePic, phone, address, password } = req.body;

   
    let updateData = { name, profilePic, phone, address };


    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password"); 

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      success: false,
      message: err.message || err,
    });
  }
};

module.exports = {
  updateAdminProfile,
};
