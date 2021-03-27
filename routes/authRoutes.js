const express  = require('express');
const router = express.Router();
const Customer = require('../models/customer');
const Seller = require('../models/seller');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
//customer routes
router.get('/customer/login',(req,res)=>{
    res.render('Auth/Customer/Login');
})

router.post('/customer/login',(req,res)=>{
    console.log("in llogin route");
    Customer.find({email:req.body.email})
            .exec()
            .then(foundCustomer=>{
                console.log(foundCustomer);
                if(foundCustomer.length==1){
                    console.log("found some user");
                    bcrypt.compare(req.body.password,foundCustomer[0].password,(err,result)=>{
                        if(err){
                            console.log(err);
                            res.send("system error");
                        }
                        if(result){
                            console.log("password matches");
                            //inside .sign put details you might need for current user(dont put password!)
                            const token = jwt.sign({
                                email:foundCustomer[0].email,
                                name:foundCustomer[0].name,
                                usertype:foundCustomer[0].usertype


                            },process.env.JWT_KEY,{
                                expiresIn:"1h"
                            })
                            console.log("token is",token);
                            res.cookie('authToken',token);
                            res.send("logged in yay");
                            
                        }
                        else{
                            console.log("auth failed");
                            res.redirect('/customer/login');
                        }
                    })
                }
            })
            .catch(err=>{
                console.log(err);
                res.send("system error");
            })
   
})

router.get('/customer/register',(req,res)=>{
    res.render('Auth/Customer/Register');
})

router.post('/customer/register',(req,res)=>{
    console.log("Inside register route");
    //check if user exits
    Customer.find({email:req.body.email})
            .exec()
            .then(foundCustomer=>{
                console.log("checking if custoemr exist or not");
                if(foundCustomer.length==0){
                    bcrypt.hash(req.body.password,10,(err,hash)=>{
                        if(err){

                            console.log(err);
                        }
                        else{
                            const user = new Customer({
                                name:req.body.name,
                                email:req.body.email,
                                phone : req.body.phone,
                                password:hash,
                                usertype:"customer"
                            })
                            user.save()
                                .then(newcustomer=>{
                                    console.log("USER SAVED");
                                    console.log(newcustomer);
                                    res.send("YAY REGISTERED");
                                })
                                .catch(err=>{
                                    console.log(err);
                                    res.send("unexpected error");
                                })
                        }
                    })
                }
                else{
                    console.log('user registered with the given mail');
                    res.redirect('/customer/register');
                }
            })
            .catch(err=>{
                console.log(err);
                console.log("user.find error");
                res.send("unexpected system error");
            })
})



//seller routes

router.get('/seller/login',(req,res)=>{
    res.render('Auth/Seller/Login');
})

router.post('/seller/login',(req,res)=>{
    Seller.find({companyEmail:req.body.companyEmail})
            .exec()
            .then(foundSeller=>{
                console.log(foundSeller);
                if(foundSeller.length==1){
                    console.log("found some seller");
                    bcrypt.compare(req.body.password,foundSeller[0].password,(err,result)=>{
                        if(err){
                            console.log(err);
                            res.send("system error");
                        }
                        if(result){
                            console.log("password matches");
                            //inside .sign put details you might need for current user(dont put password!)
                            const token = jwt.sign({
                                companyEmail:foundSeller[0].companyEmail,
                                companyName:foundSeller[0].companyName,
                                phone:foundSeller[0].phone,
                                usertype:foundSeller[0].usertype


                            },process.env.JWT_KEY,{
                                expiresIn:"1h"
                            })
                            console.log("token is",token);
                            res.cookie('authToken',token);
                            res.redirect('/seller/home');
                            
                        }
                        else{
                            console.log("auth failed");
                            res.redirect('/seller/login');
                        }
                    })
                }
            })
            .catch(err=>{
                console.log(err);
                res.send("system error");
            })
   
    
})

router.get('/seller/register',(req,res)=>{
    res.render('Auth/Seller/Register');
})

router.post('/seller/register',(req,res)=>{
    Seller.find({email:req.body.companyEmail})
    .exec()
    .then(foundSeller=>{

        if(foundSeller.length==0){
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){

                    console.log(err);
                }
                else{
                    const user = new Seller({
                        companyName:req.body.companyName,
                        city:req.body.city,
                        companyEmail:req.body.companyEmail,
                        phone : req.body.phone,
                        password:hash,
                        usertype:"seller"
                    })
                    user.save()
                        .then(newseller=>{
                            console.log("USER SAVED");
                            console.log(newseller);
                            res.send("YAY REGISTERED");
                        })
                        .catch(err=>{
                            console.log(err);
                            res.send("unexpected error");
                        })
                }
            })
        }
        else{
            console.log('user registered with the given mail');
            res.redirect('/seller/register');
        }
    })
    .catch(err=>{
        console.log(err);
        console.log("user.find error");
        res.send("unexpected system error");
    })
})

module.exports = router;