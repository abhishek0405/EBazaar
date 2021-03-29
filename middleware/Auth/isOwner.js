module.exports = (req,resp,next)=>{
    if(req.userData && req.userData.id==){
        next();
    }
    else{
        resp.send("you are not a seller");
    }
}