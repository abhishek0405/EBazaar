const express  = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const stripe = require('stripe')(process.env.SECRET_KEY)

router.get('/',(req,res)=>{
    console.log(process.env.PUBLISHABLE_KEY)
    res.render("Payment/MakePayment",{key:process.env.PUBLISHABLE_KEY});
})

router.post('/', function(req, res){ 

    // Moreover you can take more details from user 
    // like Address, Name, etc from form 
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
        res.send("Success") // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)    // If some error occurs 
    }); 
}) 

module.exports = router;

