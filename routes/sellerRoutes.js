const express  = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Seller = require('../models/seller');
const isLoggedIn = require('../middleware/Auth/isLoggedin');
const isSeller = require('../middleware/Auth/isSeller');
router.get('/home',isLoggedIn,isSeller,(req,res)=>{
    
    res.render('Seller/sellerHome',{userData:req.userData});
})


module.exports = router;