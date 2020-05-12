const Jwt = require('jsonwebtoken');
const { StudentScrete } = require('../secure/secure');

exports.AdminJwtMiddeware = (req,res,next)=>{
    let authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let verifyAuth; 
    try {
        verifyAuth = Jwt.verify(token,StudentScrete);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    finally{
        if(!verifyAuth){
            req.isAuth = false;
            return next();
        }
        req.userIdStudent = verifyAuth.userIdSt;
        req.studentToken = token;
        req.isAuth = true;
        next();
    }
}