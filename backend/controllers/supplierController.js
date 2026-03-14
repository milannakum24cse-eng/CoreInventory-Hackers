const Supplier = require("../../models/Supplier");
const { asyncHandler } = require("../../middleware/errorHandler");

const getSuppliers = asyncHandler(async(req,res)=>{
 const suppliers = await Supplier.find().sort({name:1});
 res.json({success:true,data:suppliers});
});

const getSupplier = asyncHandler(async(req,res)=>{
 const supplier = await Supplier.findById(req.params.id);

 if(!supplier){
  res.status(404);
  throw new Error("Supplier not found");
 }

 res.json({success:true,data:supplier});
});

const createSupplier = asyncHandler(async(req,res)=>{
 const supplier = await Supplier.create(req.body);
 res.status(201).json({success:true,data:supplier});
});

const updateSupplier = asyncHandler(async(req,res)=>{
 const supplier = await Supplier.findByIdAndUpdate(
  req.params.id,
  req.body,
  {new:true,runValidators:true}
 );

 if(!supplier){
  res.status(404);
  throw new Error("Supplier not found");
 }

 res.json({success:true,data:supplier});
});

const deleteSupplier = asyncHandler(async(req,res)=>{
 const supplier = await Supplier.findByIdAndDelete(req.params.id);

 if(!supplier){
  res.status(404);
  throw new Error("Supplier not found");
 }

 res.json({success:true,message:"Supplier deleted"});
});

module.exports={
 getSuppliers,
 getSupplier,
 createSupplier,
 updateSupplier,
 deleteSupplier
};