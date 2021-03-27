const express  = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Seller = require('../models/seller');
const isLoggedIn = require('../middleware/Auth/isLoggedin');
const isSeller = require('../middleware/Auth/isSeller');
router.get('/home',isLoggedIn,isSeller,(req,res)=>{
    Seller.findById(req.userData.id)
          .populate('myProducts')
          .exec()
          .then(foundSeller=>{
              console.log("the seller found is ");
              console.log(foundSeller);
            res.render('Seller/sellerHome',{userData:req.userData,myProducts:foundSeller.myProducts});
          })
          .catch(err=>{
              console.log(err);
              res.send("Unexpected err");
          })
    
})


module.exports = router;