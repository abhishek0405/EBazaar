const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name:{type:String,requried:true},
    description:{type:String,requried:true},
    categoryImage: 
    { 
        data: Buffer, 
        contentType: String 
    } 

   
})

module.exports = mongoose.model('Category',categorySchema); 