const productModel = require("../../models/productModel")

const getProductController= async(req,res)=> {
    try{
        const query = {};



const allProduct = await productModel.find(query).sort({ createdAt: -1 });

console.log(allProduct)

        res.json({
            message: "All product",
            success:true,
            error:false,
            data: allProduct 
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }

}
module.exports = getProductController