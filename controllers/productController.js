const expressAsyncHandler = require('express-async-handler');
const Product = require('../model/Product');

const getproducts = expressAsyncHandler(async(req,res)=>{
    const products = await Product.find();
    if(!products || products.length === 0){
        return res.status(404).json({message:"No products found"});
    }
    return res.status(200).json({products});
});

const getproduct = expressAsyncHandler(async(req,res)=>{
    
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if(!product){
        return res.status(404).json({message:"Product not found"});
    }
    return res.status(200).json({product});
});

module.exports = {getproducts, getproduct};