const Jwt = require('jsonwebtoken');
const { AdminScrete } = require('../secure/secure');

exports.AdminJwtMiddeware = (req,res,next)=>{
    let authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let verifyAuth; 
    try {
        verifyAuth = Jwt.verify(token,AdminScrete);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    finally{
        if(!verifyAuth){
            req.isAuth = false;
            return next();
        }
        req.userIdAdmin = verifyAuth.userIdAd;
        req.adminToken = token;
        req.isAuth = true;
        next();
    }
}