const userModel = require("../../models/userModel")

async function allUsersController(req,res) {
    try{
  
        const allUser = await userModel.find().select("name email role status  profilePic");
        const total = await userModel.countDocuments({ role: "GENERAL" })


        res.json({
            message:"All User",
            data:{ allUser,
            total},
            success: true,
            error: false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success: false

        })
    }
    
}
module.exports = allUsersController