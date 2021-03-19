const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name:{type:String,requried:true},
    category:{type:String,requried:true},
    seller:{type:String,required:true},
    stock:{type:Number,required:true},
    discount:{type:Number,required:true},
    description:{type:String,requried:true},
    price:{type:Number, required:true},
    productImage:{type:String,required:true}//type String as we will show only url pointing to the image in DB.
})

module.exports = mongoose.model('Product',productSchema); 