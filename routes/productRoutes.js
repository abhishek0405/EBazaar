const express  = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const isLoggedin = require('../middleware/Auth/isLoggedin');
const isSeller = require('../middleware/Auth/isSeller');
const isCustomer = require('../middleware/Auth/isCustomer');
//show all products
router.get('/',isLoggedin,(req,res)=>{
    Product.find()
            .exec()
            .then(allProducts=>{
                res.render('Product/ShowProduct',{products:allProducts});
            })
            .catch(err=>{
                console.log("Could not fetch products",err);
                res.status(500).send("Error while adding product.Try again");
            })
    
})
//post product
router.post('/',(req,res)=>{
    console.log("received");
    console.log(req.body);
    
    const product = new Product(req.body);
    product.save()
            .then(newProduct=>{
                console.log("PRODUCT ADDED SUCCESFULLY");
                res.redirect('/products');
            })
            .catch(err=>{
                console.log(err);
                res.status(500).send("Error while adding product.Try again");
            })

    
})

//add new product route
router.get('/new',isLoggedin,isSeller,(req,res)=>{
    Category.find()
             .exec()
             .then(foundCategory=>{
                res.render('Product/AddProduct',{category:foundCategory,userData:req.userData});
             })
             .catch(err=>{
                 console.log("could not fetch category",err);
                 res.send("error occcured")
             })
    
   
})






module.exports = router;