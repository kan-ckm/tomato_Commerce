const userModel = require("../../models/userModel");
const getAdminDetailsController = async (req, res) => {
    try {
      const user = await userModel.findById(req.userId).select("-password");
  
      if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
  
      res.json({
        success: true,
        message: "Admin details",
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error fetching admin details",
      });
    }
  };
  module.exports = getAdminDetailsController