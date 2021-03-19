const express  = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/',(req,res)=>{

    res.render('Product/ShowProduct');
})

router.post('/',(req,res)=>{
    console.log(req.body);
    
})




module.exports = router;