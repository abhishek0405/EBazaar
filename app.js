const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const { reverse } = require('methods');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());//to read json from posterquests
app.set("view engine","ejs");
app.get('/',(req,res)=>{
    res.render("home");
})
app.use(authRoutes); 
app.use('/products',productRoutes);
app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error); 
})

//whatever error redirected and  handled here
app.use((error,req,res,next)=>{
    res.send("Could not find page")
});


module.exports = app;