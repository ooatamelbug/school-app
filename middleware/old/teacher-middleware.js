const Jwt = require('jsonwebtoken');
const { TeacherScrete } = require('../secure/secure');

exports.AdminJwtMiddeware = (req,res,next)=>{
    let authHeader = req.get('Authorization');
    if(!authHeader){
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    let verifyAuth; 
    try {
        verifyAuth = Jwt.verify(token,TeacherScrete);
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    finally{
        if(!verifyAuth){
            req.isAuth = false;
            return next();
        }
        req.userIdTeacher = verifyAuth.userIdTr;
        req.TeacherToken = token;
        req.isAuth = true;
        next();
    }
}