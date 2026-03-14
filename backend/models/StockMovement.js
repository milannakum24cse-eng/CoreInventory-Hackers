const mongoose = require("mongoose");

const stockMovementSchema = new mongoose.Schema(
{
 product:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Product",
  required:true
 },

 type:{
  type:String,
  enum:["IN","OUT","ADJUSTMENT"],
  required:true
 },

 quantity:{
  type:Number,
  required:true
 },

 quantityBefore:{
  type:Number,
  required:true
 },

 quantityAfter:{
  type:Number,
  required:true
 },

 reason:{
  type:String,
  default:""
 },

 reference:{
  type:String,
  default:""
 },

 performedBy:{
  type:String,
  default:"system"
 }

},
{timestamps:true}
);

module.exports = mongoose.model("StockMovement",stockMovementSchema);