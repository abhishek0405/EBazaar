const express  = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const Seller = require('../models/seller');
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
    //return res.json("will render waito");
    const product = new Product(req.body);
    product.save()
            .then(newProduct=>{
                console.log("PRODUCT ADDED SUCCESFULLY");
                //add the product id to the seller's products
                Seller.findById(req.body.seller)
                       .exec()
                       .then(foundSeller=>{
                           console.log("found this seller");
                           console.log(foundSeller);
                           foundSeller.myProducts.push(newProduct._id);
                           foundSeller.save();
                           res.redirect('/products');
                       })
                       

                
                
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

//route to edit product config
router.get('/edit/:id',isLoggedin,isSeller,(req,res)=>{
    Product.findById(req.params.id)
            .exec()
            .then(foundProduct=>{
                if(foundProduct.seller.toString()==req.userData.id){
                    console.log("authorised");
                    res.render("Product/EditProduct",{myProduct:foundProduct});
                } 
                else{
                    return res.send("not authorised");
                }
                
            })
            .catch(err=>{
                console.log(err);
                res.send("systtem error");
            })
    
})
//@TODO: Only certified seller can update
router.patch('/:id',isLoggedin,isSeller,(req,res)=>{
    console.log("in edit route");
    console.log(req.body);
   
    Product.findById(req.params.id)
            .exec()
            .then(foundProduct=>{
                if(foundProduct.seller.toString()==req.userData.id){
                    Product.updateOne({_id:req.params.id},{$set:req.body})
                            .exec()
                            .then(updatedProduct=>{
                                console.log("product updated");
                                res.redirect('/seller/home');
                            })
                            .catch(err=>{
                                console.log(err);
                                res.send("system error")
                            })
                } 
                else{
                    return res.send("not authorised");
                }
                
            })
    
})






module.exports = router;