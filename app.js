const express = require('express');
const app = express();
app.use(express.static('public'));
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes')
const cartRoutes = require('./routes/cartRoutes');
const paymentRoutes = require("./routes/paymentRoutes")

const mongoose = require('mongoose');
const Product = require("./models/product.js")
const uri = "mongodb+srv://abhishek:"+process.env.DB_KEY+"@cluster0.dfvfh.mongodb.net/EbazaarDB?retryWrites=true&w=majority";
console.log(uri);
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=>console.log('CONNECTED'))
        .catch((err)=>{
            console.log('COULD NOT CONNECT');
            console.log(err);
        });
app.use(cookieParser())
app.use(express.json());
app.use(
    express.urlencoded({
      extended: false
    })
);
app.use(methodOverride("_method"));



app.use(morgan('dev'));
app.set("view engine","ejs");

app.get('/',(req,res)=>{
    
    res.render("home");
})
app.use(authRoutes); 
app.use('/products',productRoutes);
app.use('/category',categoryRoutes);
app.use('/seller',sellerRoutes);
app.use('/wishlist', wishlistRoutes)
app.use('/cart', cartRoutes)
app.use('/payments', paymentRoutes)

app.use((req,res,next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error); 
})

//whatever error redirected and  handled here
// app.use((error,req,res,next)=>{
//     res.send("Could not find page")
// });


module.exports = app;