const express  = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Seller = require('../models/seller');
const isLoggedIn = require('../middleware/Auth/isLoggedin');
const isSeller = require('../middleware/Auth/isSeller');
const isLoggedin = require('../middleware/Auth/isLoggedin');


router.get('/home',isLoggedIn,isSeller,(req,res)=>{
    res.render('Seller/sellerHome')
})

router.get('/products',isLoggedIn,isSeller,(req,res)=>{
    Seller.findById(req.userData.id)
          .populate('myProducts')
          .exec()
          .then(foundSeller=>{
              console.log("the seller found is ");
              console.log(foundSeller);
            res.render('Seller/products',{userData:req.userData,myProducts:foundSeller.myProducts});
          })
          .catch(err=>{
              console.log(err);
              res.send("Unexpected err");
          })
})

router.get('/orders',isLoggedin,isSeller,(req,res)=>{
  console.log(req.userData.id)
  Seller.findById(req.userData.id)
        .populate(' myOrders.products myOrders.customer')
        .exec()
        .then(foundSeller=>{
          // foundSeller.myOrders.forEach(element => {
          //   console.log(element.products)
          // });
          res.render("Seller/orders.ejs",{orders:foundSeller.myOrders.reverse()})
        })
        .catch(Err=>{
          console.log(Err);
        })
  
  
})


module.exports = router;