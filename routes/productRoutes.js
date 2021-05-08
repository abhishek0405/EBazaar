const express  = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');
const Category = require('../models/category');
const Seller = require('../models/seller');
const Review = require('../models/review');
const Keyword = require('../models/keywords');
const Customer = require('../models/customer')
const isLoggedin = require('../middleware/Auth/isLoggedin');
const isSeller = require('../middleware/Auth/isSeller');
const isCustomer = require('../middleware/Auth/isCustomer');
const isOwner = require('../middleware/Auth/isOwner');
const fs   = require('fs');
const path = require('path');
const multer = require('multer');
const async = require('async');
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads/products') 
    }, 
    filename: (req, file, cb) => { 
        
        cb(null, file.originalname); 
    } 
}); 
const uploadsPath = path.join(__dirname,'../');


async function getProducts(query_arr){
    let matchedProducts=[];
    for(let word of query_arr){

        let obj = await Keyword.find({keyword:word});
        if(obj.length>0){
            matchedProducts.push(...obj[0].products)
        }
        

        
    }
    return matchedProducts;
}
 //Searching routes
 router.post('/search/',isLoggedin,async(req,res)=>{
     //NEW APPROACH
     //STORE KEYWORDS IN COLLECTION IE keyword,array of product ids.
     //for each word in keyword,get the product Ids and render.
    let query_arr = req.body.searchtext.split(" ");
    query_arr = query_arr.map(word =>word.toLowerCase());
    console.log(query_arr);
    let matchedProducts = await getProducts(query_arr);

    //find products
    let final_products=[]
    for(let prod of matchedProducts){
        let obj = await Product.findById(prod)
        final_products.push(obj);
    }
    console.log(final_products);
    res.render("Product/ShowQueryProducts",{products:final_products,query:req.body.searchtext});
    
    
   

})

//filter the searched products
router.post("/filter",isLoggedin,(req,res)=>{
    console.log(req.body);
    product_ids = req.body.prod_id.split(",");
    console.log(product_ids);

    Product.find({$and:[
        {
            _id:{$in:product_ids}
        },
        {
            price:{$gte:req.body.mini}
        },
        {
            price:{$lte:req.body.maxi}
        }

    ]

    })
    .exec()
    .then(foundProducts=>{
        res.render('Product/ShowFilteredProducts',{products:foundProducts})
    })
    .catch(err=>{
        console.log(err);
    })
})


//add new product route
router.get('/new',isLoggedin,isSeller,(req,res)=>{
    console.log("hit");
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

//get specific product
router.get('/:id',isLoggedin,(req,res)=>{
    Product.findById(req.params.id)
            .populate('seller')
            .exec()
            .then(foundProduct=>{
                res.render("Product/ShowProductID",{product:foundProduct});
            })
            .catch(err=>{
                console.log(err);
            })
    
})
//post product
router.post('/',upload.single('photo'),(req,res)=>{
    
    console.log("received");
    console.log(req.body);
    var id= new mongoose.Types.ObjectId();
    console.log(id);
    
    const productObj = {
        _id:id,
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
                           keyphrase_arr = req.body.keyphrase.split(" ");
                           console.log(keyphrase_arr);
                           
                           for(let word of keyphrase_arr ){
                               word = word.toLowerCase();
                               console.log("word is ",word);
                               //this checks whether string empty or not
                               if(!(word.replace(/\s/g,"") == "")){
                            
                               Keyword.find({keyword:word})
                                      .exec()
                                      .then(foundKeyword=>{
                                          console.log("The keyword objext array found for "+word);
                                          console.log(foundKeyword);
                                          if(foundKeyword.length==0){
                                               let keywordObj = {
                                                   keyword:word,
                                                   products:[id]
                                               }
                                               const newKeyword = new Keyword(keywordObj);
           
                                               newKeyword.save()
                                                         .then(pro=>{
                                                             console.log("added keyword");
                                                         })
                                                         
                                          }
                                          else{
                                               foundKeyword[0].products.push(id);//adding product id
                                               foundKeyword[0].save();
                                          }
                                          
                                      })
                                    }

                                    
           
                           }


                           res.redirect('/seller/home');
                               
                       })
                       .catch(err=>{
                           console.log(err);
                           res.status(500).send("Error while adding product.Try again");
                       })
                           
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