const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
{
 name:{
  type:String,
  required:[true,"Supplier name is required"],
  trim:true
 },

 contactPerson:{
  type:String,
  default:""
 },

 email:{
  type:String,
  trim:true,
  lowercase:true
 },

 phone:{
  type:String,
  default:""
 },

 address:{
  type:String,
  default:""
 },

 isActive:{
  type:Boolean,
  default:true
 }

},
{timestamps:true}
);

module.exports = mongoose.model("Supplier",supplierSchema);