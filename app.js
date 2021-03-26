const express = require('express');
const app = express();
app.use(express.static('public'));
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const mongoose = require('mongoose');
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
  

app.use(morgan('dev'));
app.set("view engine","ejs");
app.get('/',(req,res)=>{
    res.render("home");
})
app.use(authRoutes); 
app.use('/products',productRoutes);
app.use('/category',categoryRoutes);
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