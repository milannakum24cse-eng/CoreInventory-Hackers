const Product = require("../models/Product");
const StockMovement = require("../models/StockMovement");
const { asyncHandler } = require("../middleware/errorHandler");

const getProducts = asyncHandler(async(req,res)=>{

 const products = await Product.find()
  .populate("category","name")
  .populate("supplier","name")
  .sort({createdAt:-1});

 res.json({success:true,data:products});

});

const getProduct = asyncHandler(async(req,res)=>{

 const product = await Product.findById(req.params.id)
  .populate("category","name")
  .populate("supplier","name email phone");

 if(!product){
  res.status(404);
  throw new Error("Product not found");
 }

 res.json({success:true,data:product});

});

const createProduct = asyncHandler(async(req,res)=>{

 const product = await Product.create(req.body);

 res.status(201).json({success:true,data:product});

});

const updateProduct = asyncHandler(async(req,res)=>{

 const product = await Product.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true,runValidators:true}
 );

 if(!product){
  res.status(404);
  throw new Error("Product not found");
 }

 res.json({success:true,data:product});

});

const deleteProduct = asyncHandler(async(req,res)=>{

 const product = await Product.findByIdAndDelete(req.params.id);

 if(!product){
  res.status(404);
  throw new Error("Product not found");
 }

 res.json({success:true,message:"Product deleted"});

});

const adjustStock = asyncHandler(async(req,res)=>{

 const {type,quantity,reason,reference} = req.body;

 const product = await Product.findById(req.params.id);

 if(!product){
  res.status(404);
  throw new Error("Product not found");
 }

 const before = product.quantity;
 let after;

 if(type==="IN") after = before + quantity;
 else if(type==="OUT"){
  if(quantity>before){
   throw new Error("Insufficient stock");
  }
  after = before - quantity;
 }
 else{
  after = quantity;
 }

 product.quantity = after;
 await product.save();

 await StockMovement.create({
  product:product._id,
  type,
  quantity,
  quantityBefore:before,
  quantityAfter:after,
  reason,
  reference:reference||""
 });

 res.json({success:true,data:{before,after}});

});

const getStockMovements = asyncHandler(async(req,res)=>{

 const movements = await StockMovement.find({product:req.params.id})
  .sort({createdAt:-1});

 res.json({success:true,data:movements});

});

module.exports = {
 getProducts,
 getProduct,
 createProduct,
 updateProduct,
 deleteProduct,
 adjustStock,
 getStockMovements
};