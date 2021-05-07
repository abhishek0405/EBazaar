const express  = require('express');
const isLoggedin = require('../middleware/Auth/isLoggedin');

const router = express.Router();
const Category  = require('../models/category');
const Product = require('../models/product');
const fs   = require('fs');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads/category') 
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

router.post('/',upload.single('photo'),(req,res)=>{
    console.log(uploadsPath);
    
    //@TODO ADD NON REPEATING CATEGORIES VALIDATION
    console.log(req.file);
    const categoryObj = {
        name:req.body.name,
        description:req.body.description,
        categoryImage:{
            data: fs.readFileSync(path.join(uploadsPath + '/uploads/category/' + req.file.filename)), 
            contentType: 'image/jpg'
        }
    }
    console.log(categoryObj);
    const category = new Category(categoryObj);
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

//filter products in given category

router.post('/filter',(req,res)=>{
    console.log(req.body);
    
    Product.find({$and:[
        {
        category:req.body.category
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
               res.render('Product/ShowFilteredProducts',{products:foundProducts});
           })
           .catch(err=>{
               console.log(err);
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