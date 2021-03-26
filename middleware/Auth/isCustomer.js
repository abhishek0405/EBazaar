module.exports = (req,resp,next)=>{
    if(req.userData && req.userData.usertype=="customer"){
        next();
    }
    else{
        resp.send("you are not a customer");
    }
}