module.exports = (req,resp,next)=>{
    if(req.userData && req.userData.usertype=="seller"){
        next();
    }
    else{
        resp.send("you are not a seller");
    }
}