const express  = require('express');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const Seller = require('../models/seller');
const Review = require('../models/review')
const isLoggedin = require('../middleware/Auth/isLoggedin');
const isSeller = require('../middleware/Auth/isSeller');
const isCustomer = require('../middleware/Auth/isCustomer');
const isOwner = require('../middleware/Auth/isOwner');
const fs   = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads/products') 
    }, 
    filename: (req, file, cb) => { 
        
        cb(null, file.originalname); 
    } 
}); 
const uploadsPath = path.join(__dirname,'../');

const fileFilter = (req,file,cb)=>{
    //reject file
    if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
        cb(null,true);//true to save
    } 
    else{
        cb(new Error('Upload only jpeg or png files!!'),false);//false to reject the file
    }
}

const upload = multer({storage:storage,limits:{
    fileSize:1024*1024*7 //in bytes hence 1024 *1024 is 1MB. Do 1MB *(number of mbs needed max limit)
},
 fileFilter:fileFilter
});

 
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
router.post('/',upload.single('photo'),(req,res)=>{
    console.log("received");
    console.log(req.body);
    const productObj = {
        name:req.body.name,
        category:req.body.category,
        seller:req.body.seller,
        stock:req.body.stock,
        discount:req.body.stock,
        description:req.body.description,
        price:req.body.price,

        productImage:{
            data: fs.readFileSync(path.join(uploadsPath + '/uploads/products/' + req.file.filename)), 
            contentType: 'image/jpg'
        }
    }
    //return res.json("will render waito");
    const product = new Product(productObj);
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
                           res.redirect('/seller/home');
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
        res.render("Product/EditProduct",{myProduct:foundProduct});
        
    })
    .catch(err=>{
        console.log(err);
        res.send("systtem error");
    })
    
})

router.patch('/:id',isLoggedin,isSeller,isOwner,(req,res)=>{
    console.log("in edit route");
    console.log(req.body);
   
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
        }) 




//delete a product
router.delete('/:id',isLoggedin,isSeller,isOwner,(req,res)=>{
    Product.remove({_id:req.params.id})
           .exec()
           .then(result=>{
                console.log("deleted yay");
                //also delete from array in seller
                Seller.updateOne({ _id: req.userData.id }, { $pull: { myProducts: req.params.id } })
                .exec()
                .then(result=>{
                    console.log("deleted from seller array");
                    res.redirect('/seller/home');
                })
                      
                
           })
           .catch(err=>{
               console.log(err);
               res.send("system error");
           })
})
               
//customer reviews
//getting `count` reviews
router.get('/:id/review', isLoggedin, (req, res)=>{
    let count = 5
    if(req.body.hasOwnProperty('count') && count>=0){
        count = req.body.count
    }
    console.log(`Loading reviews Limit(${count})`)
    Review.find({product: req.params.id}).limit(count).then(reviews => {
        console.log(`reviews found: ${reviews}`)
        res.render('Product/ShowReviews', {reviews: reviews})
    })
    .catch(err=>{
        console.log(err);
        res.send("system error");
    })
})

//posting/update a review
router.post('/:id/review', isLoggedin, isCustomer, (req, res)=>{
    // Review.count({product: req.params.id, customer: req.userData.id}, (err, count)=>{
    //     if(count>0){
    //         res.send("review already exists, please update")
    //     } else if(err){
    //         console.log(err);
    //         res.send("system error");
    //     } else {
    //         let review = new Review({
    //             product: req.params.id,
    //             customer: req.userData.email,
    //             rating: req.body.rating,
    //             review: req.body.review ? req.body.review : ''
    //         })
    //         review.save()
    //             .then(()=>{
    //                 res.send("Added review")
    //                 console.log("Review added:")
    //                 console.log(review)
    //             }).catch(err=>{
    //                 console.log(err);
    //                 res.send("system error");
    //             })
    //     }
    // })
    Review.updateOne({
        product: req.params.id,
        customerEmail: req.userData.email,
    }, {
        rating: req.body.rating,
        review: req.body.review ? req.body.review : ''
    }, {
        upsert: true
    }).exec().then(upsertReview => {
        console.log(`Upsert: review: rating: ${upsertReview.rating}, review: ${upsertReview.review}}`)
        res.send("yay added")
    }).catch(error => {
        console.log(error)
        res.send("system error")
    })    
})
//delete review
router.delete('/:id/review', isLoggedin, isCustomer, (req, res)=>{
    Review.remove({
        product: req.params.id,
        customerEmail: req.userData.email
    }).exec().then(result => {
        res.send("yay deleted")
        console.log("deleted yay")
    }).catch(error => {
        res.send("system error")
    })
})






module.exports = router;