const express  = require('express');
const mongoose = require('mongoose');
const Seller = require('../models/seller');
const Product = require('../models/product');
const isLoggedin = require('../middleware/Auth/isLoggedin');
const isCustomer = require('../middleware/Auth/isCustomer');
const router = express.Router();
const stripe = require('stripe')(process.env.SECRET_KEY)

router.get('/',(req,res)=>{
    console.log(process.env.PUBLISHABLE_KEY)
    res.render("Payment/MakePayment",{key:process.env.PUBLISHABLE_KEY});
})

router.post('/',isLoggedin,isCustomer, function(req, res){ 
    console.log(req.body.orderDetails);
    let orderDetails = JSON.parse(req.body.orderDetails);
    console.log(orderDetails)
    //customer and adrress obj
    console.log(req.userData);
    let customerID=req.userData.id;
    console.log("customer is",customerID);
    let address= {
        line1: req.body.line1,
        postal_code: req.body.postal_code,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
      }
    


    
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: req.body.name, 
        address: {
            line1: req.body.line1,
            postal_code: req.body.postal_code,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
          }
        
    }) 
    .then((customer) => { 

        return stripe.charges.create({ 
            amount: req.body.bill,    // Charing Rs 25 
            description: req.body.description, 
            currency: 'INR', 
            customer: customer.id,
           
        }); 
    }) 
    .then((charge) => { 

        for (let key in orderDetails) {
            console.log(key);
            Seller.findById(key)
                  .exec()
                  .then(foundSeller=>{
                    for(let productObj of orderDetails[key]){
                        console.log(productObj)
                    
                        let orderObj={
                            customer:customerID,
                            address:address,
                            products:productObj.product,
                            count:productObj.count,
                            status:"Ordered"
                
                        }
                        console.log("order obj")
                        console.log(orderObj)
                        foundSeller.myOrders.push(orderObj);
                        let payment =  foundSeller.save();
                        console.log("DONEE")
                    }
                        
                  })
        }
                  
        
        res.render("Payment/SuccessShow.ejs") // If no error occurs 
    }) 

    .catch((err) => { 
        res.send(err)    // If some error occurs 
    }); 
}) 

router.get('/succ',(req,res)=>{
    res.render("Payment/SuccessShow.ejs") // If no error occurs 
})

module.exports = router;

