const mongoose = require('mongoose');

const keywordSchema = mongoose.Schema({
    keyword:{type:String,requried:true},
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}]
    

   
})

module.exports = mongoose.model('Keyword',keywordSchema); 