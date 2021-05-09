const mongoose = require('mongoose');

const sellerSchema = mongoose.Schema({
    companyName:{type:String,requried:true},
    city:{type:String,requried:true},
    companyEmail:{type:String,requried:true},
    phone:{type:String,requried:true},
    password:{type:String,requried:true},
    usertype:{type:String,default:"seller"}, //if undefiend in form then default used
    myProducts:[{type:mongoose.Schema.Types.ObjectId,ref:'Product'}],
    myOrders:[{
        customer:{type:mongoose.Schema.Types.ObjectId,ref:'Customer'},
        address:{type:Object},
        products:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
        count:{type:Number},
        status:{type:String}
    }]


   
})

module.exports = mongoose.model('Seller',sellerSchema); 