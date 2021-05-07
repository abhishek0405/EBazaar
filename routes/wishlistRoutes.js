const express  = require('express');
const router = express.Router();
const Customer = require('../models/customer')
const isLoggedin = require('../middleware/Auth/isLoggedin');
const isCustomer = require('../middleware/Auth/isCustomer');

//get wishes
router.get('/', isLoggedin, isCustomer, (req, res) => {
    Customer.findOne({email: req.userData.email}).exec().then(customer => {
        res.render('Product/ShowWishlist', {wishes: customer.wishlist})
    }).catch(error => {
        res.send("not found/system error")
    })
})

//add/delete wishes
router.post('/', isLoggedin, isCustomer, (req, res) => {
    console.log(`POST request ${JSON.stringify(req.body)}`)
    Customer.findOne({email: req.userData.email}).exec().then(customer => {
        Customer.updateOne(
            {_id: customer._id},
            {$push: {wishlist: req.body.id}}   //TODO: what if it already exists, increase count?
        ).exec().then(result => {
            res.send("yay added")
            console.log(`added wishlist: ${JSON.stringify(result)}`)
        }).catch(error => {
            console.log(error)
            res.send("system error")
        })
    }).then(result => {
        res.send("yay added")
        console.log(`added wishlist: ${JSON.stringify(result)}`)
    }).catch(error => {
        console.log(error)
        res.send("system error")
    })    
})

router.delete('/', isLoggedin, isCustomer, (req, res) => {
    console.log(`DELETE request`)
    Customer.updateOne({email: req.userData.email}, {$pull: {wishlist: req.body.id}}).exec().then(result=>{
        res.send("Deleted yay")
    }).catch(error => {
        console.log(error)
        res.send("system error")
    })   
})

module.exports = router