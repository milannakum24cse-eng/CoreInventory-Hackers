const Category = require("../models/Category");
const { asyncHandler } = require("../middleware/errorHandler");

const getCategories = asyncHandler(async(req,res)=>{
 const categories = await Category.find().sort({name:1});
 res.json({success:true,data:categories});
});

const getCategory = asyncHandler(async(req,res)=>{
 const category = await Category.findById(req.params.id);

 if(!category){
  res.status(404);
  throw new Error("Category not found");
 }

 res.json({success:true,data:category});
});

const createCategory = asyncHandler(async(req,res)=>{
 const category = await Category.create(req.body);
 res.status(201).json({success:true,data:category});
});

const updateCategory = asyncHandler(async(req,res)=>{
 const category = await Category.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true,runValidators:true}
 );

 if(!category){
  res.status(404);
  throw new Error("Category not found");
 }

 res.json({success:true,data:category});
});

const deleteCategory = asyncHandler(async(req,res)=>{
 const category = await Category.findByIdAndDelete(req.params.id);

 if(!category){
  res.status(404);
  throw new Error("Category not found");
 }

 res.json({success:true,message:"Category deleted"});
});

module.exports={
 getCategories,
 getCategory,
 createCategory,
 updateCategory,
 deleteCategory
};