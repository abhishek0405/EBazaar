const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{type:String,requried:true},
    category:{type:mongoose.Schema.Types.ObjectId,ref:'Category',requried:true}, //name given in category.js module while exporting
    seller:{type:mongoose.Schema.Types.ObjectId,ref:'Seller',required:true},
    stock:{type:Number,required:true},
    discount:{type:Number,required:true},
    description:{type:String,requried:true},
    price:{type:Number, required:true},
    imageURL:{type:String},
    productImage: 
    { 
        data: Buffer, 
        contentType: String 
    },
    // review: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}]

   
})

module.exports = mongoose.model('Product',productSchema); 