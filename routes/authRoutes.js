const express  = require('express');
const router = express.Router();

//customer routes
router.get('/customer/login',(req,res)=>{
    res.render('Auth/Customer/Login');
})

router.get('/customer/register',(req,res)=>{
    res.render('Auth/Customer/Register');
})

//seller routes

router.get('/seller/login',(req,res)=>{
    res.render('Auth/Seller/Login');
})

router.get('/seller/register',(req,res)=>{
    res.render('Auth/Seller/Register');
})

module.exports = router;