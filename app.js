const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
app.use(express.json());

app.use(
    express.urlencoded({
      extended: false
    })
);
  

app.use(morgan('dev'));
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