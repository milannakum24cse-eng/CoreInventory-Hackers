const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
 name:{
  type:String,
  required:[true,"Product name is required"],
  trim:true
 },

 sku:{
  type:String,
  required:[true,"SKU is required"],
  unique:true,
  uppercase:true,
  trim:true
 },

 description:{
  type:String,
  default:""
 },

 category:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Category",
  required:true
 },

 supplier:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Supplier"
 },

 price:{
  type:Number,
  required:true,
  min:0
 },

 costPrice:{
  type:Number,
  default:0
 },

 quantity:{
  type:Number,
  default:0,
  min:0
 },

 lowStockThreshold:{
  type:Number,
  default:10
 },

 unit:{
  type:String,
  default:"pcs"
 },

 location:{
  type:String,
  default:"",
  trim:true
 },

 isActive:{
  type:Boolean,
  default:true
 }

},
{timestamps:true}
);

productSchema.virtual("isLowStock").get(function(){
 return this.quantity <= this.lowStockThreshold;
});

productSchema.set("toJSON",{virtuals:true});

productSchema.index({sku:1});
productSchema.index({category:1});
productSchema.index({supplier:1});

module.exports = mongoose.model("Product",productSchema);