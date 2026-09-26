const mongoose = require("mongoose")
require("dotenv").config();




 async function connectDB() {
    try{
           await mongoose.connect(process.env.MONGODB_URI)
            console.log("kết nối thành công")
    }catch(err){
        console.log(err)
    }
 }
 module.exports = connectDB