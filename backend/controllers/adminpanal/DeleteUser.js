const User = require('../../models/userModel');
const Comment = require('../../models/reviewModel');
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedComments = await Comment.deleteMany({ userId: userId }); 
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully"
, success: true, error: false });

  } catch(err){
    res.status(400).json({
        message: err.message||err,
        error : true,
        success:false
    })

}
};

module.exports = {
  deleteUser,
};
