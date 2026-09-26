const User = require("../../models/userModel");
const bcrypt = require('bcryptjs');  

const updateUserProfile = async (req, res) => {
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


const resetPasswordProfile = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { currentPassword, newPassword } = req.body;
    
        const user = await User.findById(userId);
        if (!user) {
               throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
     if (!isMatch) {
       throw new Error('Current password is incorrect');
     }
    if(!currentPassword){
      throw new Error('Current password is required')
    }
    if (!currentPassword || !newPassword) {
       throw new Error('Missing fields')
    }
 
    if (currentPassword === newPassword) {
      throw new Error('New password must be different from the current password')
    }
   const passwordStrengthPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordStrengthPattern.test(newPassword)) {
         throw new Error('New password must be at least 8 characters long and contain both letters and numbers.')
      }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
       
        res.json({
            message: err.message || err, 
            error: true,  
            succsess: false, 
        });
};
}


module.exports = {
  resetPasswordProfile,
  updateUserProfile
};
