const jwt = require('jsonwebtoken');
module.exports = (req,resp,next)=>{
    try{
    const token = req.cookies.authToken;
    console.log("Token is",token);
    console.log(token);
    const decoded = jwt.verify(token,process.env.JWT_KEY);//stores the token and verifies if same
    req.userData = decoded;//created new field use thhis to check if admin or Not.
    console.log(req.userData);
    next();
    } catch(error){
        return resp.status(401).send("Not authenticated");
    }

}