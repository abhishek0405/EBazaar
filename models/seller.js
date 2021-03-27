const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    companyName:{type:String,requried:true},
    city:{type:String,requried:true},
    companyEmail:{type:String,requried:true},
    phone:{type:String,requried:true},
    password:{type:String,requried:true},
    usertype:{type:String,default:"seller"}, //if undefiend in form then default used
    myProducts:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}]


   
})

module.exports = mongoose.model('Seller',sellerSchema); 