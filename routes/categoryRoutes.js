const express  = require('express');
const isLoggedin = require('../middleware/Auth/isLoggedin');

const router = express.Router();
const Category  = require('../models/category');
const Product = require('../models/product');


//category/all
router.get('/',(req,res)=>{
    console.log(req.userData);
    Category.find()
            .exec()
            .then(foundCategories=>{
                console.log(foundCategories);
                res.render("Category/ShowCategory",{categories:foundCategories});

            })
            .catch(err=>{
                console.log(err);
                res.send("Error while loading");
            })
})

router.get('/new',(req,res)=>{
    res.render("Category/AddCategory")
})

router.post('/',(req,res)=>{
    //@TODO ADD NON REPEATING CATEGORIES VALIDATION
    
    const category = new Category(req.body);
    category.save()
            .then(newCategory=>{
                console.log("POST SUCCESFUL");
                console.log(newCategory);
                res.redirect('/category')
            })
            .catch(err=>{
                console.log(err);
                res.send("error while adding category");
            })

})
//view products of specific category
router.get('/:id',(req,res)=>{
    let categoryId = req.params.id;
    Category.findById(categoryId)
            .exec()
            .then(foundCategory=>{
                Product.find({category:categoryId})
                //.populate('category') can do if needed
                .exec()
                .then(foundProducts=>{
                    console.log(foundProducts);
                    res.render('Product/ShowProductCategoryWise',{products:foundProducts,category:foundCategory});
                })
            })
   
            
           .catch(err=>{
               console.log("Error while fetching products",err);
               res.send("Unexpected error")
           })
})

module.exports = router;

// foundProducts.forEach(product=>{
//     if(product.category &&product.category.toString()==categoryId){
//         console.log(product);
//     }