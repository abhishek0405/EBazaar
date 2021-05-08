const express  = require('express');
const router = express.Router();
const Customer = require('../models/customer')
const isLoggedin = require('../middleware/Auth/isLoggedin');
const isCustomer = require('../middleware/Auth/isCustomer');

//get cart items
router.get('/', isLoggedin, isCustomer, (req, res) => {
    Customer.findOne({email: req.userData.email}).populate('cart.product').exec().then(customer => {
        console.log(customer.cart)
        res.render('Product/ShowCart', {cartItems: customer.cart})
    }).catch(error => {
        console.log(error)
        res.send("not found/system error")
    })
})

//add/delete cart items
//TODO: check in stock
router.post('/', isLoggedin, isCustomer, (req, res) => {
    console.log(`POST request ${JSON.stringify(req.body)}`)
    Customer.findOne({email: req.userData.email}).exec().then(customer => {
        Customer.updateOne(
            {_id: customer._id},
            {$push: {cart: {product: req.body.id, count: req.body.count}}}   //TODO: what if it already exists, increase count?
        ).exec().then(result => {
            res.send("yay added")
            console.log(`added cart: ${JSON.stringify(result)}`)
        }).catch(error => {
            console.log(error)
            res.send("system error")
        })
    }).then(result => {
        res.redirect('/cart');
        console.log(`added cart: ${JSON.stringify(result)}`)
    }).catch(error => {
        console.log(error)
        res.send("system error")
    })    
})

router.patch('/', isLoggedin, isCustomer, (req, res) => {
    console.log('PATCH request')
    console.log(req.body)
    Customer.findOne({email: req.userData.email}).exec().then(customer => {
        Customer.updateOne(
            {_id: customer._id},
            {cart: {product: req.body.id, count: req.body.count}}   //TODO: what if it already exists, increase count?
        ).exec().then(result => {
            res.send("yay updated")
            console.log('updated quantity:')
            console.log(result)
        }).catch(error => {
            console.log(error)
            res.send("system error")
        })
    }).then(result => {
        // res.send("yay added")
        console.log(result)
    }).catch(error => {
        console.log(error)
        res.send("system error")
    })
})

router.delete('/', isLoggedin, isCustomer, (req, res) => {
    console.log(`DELETE request`)
    Customer.updateOne(
        {email: req.userData.email},
        {$pull: {cart: {product: req.body.id}}}
    ).exec().then(result => {
        res.redirect('/cart')
    }).catch(error => {
        console.log(error)
        res.send("system error")
    })   
})

router.get('/bill', isLoggedin, isCustomer, (req, res) => {
    Customer.findOne({email: req.userData.email}).populate('cart.product ').exec().then(customer => {

        var filter = []
        var total = 0.0
        
        customer.cart.forEach(element => {
            var cost = element.count*(element.product.price-element.product.discount)
            total += cost
            filter.push({
                name: element.product.name,
                seller: element.product.seller,
                price: cost,
                productImage: element.product.productImage
            })
        })
        res.render('Product/ShowOrderSummary', {cartItems: {products: filter, total: total},key:process.env.PUBLISHABLE_KEY,Name:req.userData.name})
    }).catch(error => {
        console.log(error)
        res.send("not found/system error")
    })
})

module.exports = router