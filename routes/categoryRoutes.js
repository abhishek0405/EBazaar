const express  = require('express');
const router = express.Router();
const Category  = require('../models/category');
//category/all
router.get('/',(req,res)=>{
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

module.exports = router;