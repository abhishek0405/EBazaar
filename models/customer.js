const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name:{type:String,requried:true},
    email:{type:String,requried:true},
    phone:{type:String,requried:true},
    password:{type:String,requried:true},
    usertype:{type:String,default:"customer"} //if undefiend in form then default used


   
})

module.exports = mongoose.model('Customer',customerSchema); 