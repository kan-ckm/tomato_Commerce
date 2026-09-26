const { model } = require("mongoose")
const userModel = require("../../models/userModel")
const userDetailesController = require("../user/userDetailes")

async function updateUserController(req,res) {
    try{
        const sessionUser =req.userId

        const {userId,email,name,role} =req.body
        const payload ={
            ...(email && {email:email}),
            ...(name && {name:name}),
            ...(role && {role:role}),

        }
        const user = await userModel.findById(sessionUser)




        const updatedUser = await userModel.findByIdAndUpdate(userId,payload)

        res.json({
            data: updatedUser,
            message:"User Updated",
            success:true,
            error:false

        })

    }catch(err){
        res.status(400).json({
            message: err.message||err,
            error : true,
            success:false
        })

    }
    
}
module.exports=updateUserController