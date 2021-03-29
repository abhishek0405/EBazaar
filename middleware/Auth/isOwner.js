
//THIS MIDDLEWARE CHECKS OWNERSHIP OF A PARTICULAR PRODUCT
const Product = require('../../models/product');

module.exports = (req,resp,next)=>{
    Product.findById(req.params.id)
            .exec()
            
            .then(foundProduct=>{
                if(foundProduct.seller.toString()==req.userData.id){
                    console.log("authorised");
                    next();
                } 
                else{
                    return res.send("not authorised");
                }
                
            })
            .catch(err=>{
                console.log(err);
                res.send("systtem error");
            })
}