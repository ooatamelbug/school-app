const Jwt = require('jsonwebtoken');
const { TeacherScrete } = require('../secure/secure');

exports.AdminJwtMiddeware = (req,res,next)=>{
    let authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('wrong Auth');
        error.statusCode = 500;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let verifyAuth; 
    try {
        verifyAuth = Jwt.verify(token,TeacherScrete);
    } catch (err) {
        error.statusCode = 500;
        throw error;
    }
    finally{
        if(!verifyAuth){
            const error = new Error('wrong Auth');
            error.statusCode = 500;
            throw error;
        }
        req.userIdTeacher = verifyAuth.userIdTr;
        req.TeacherToken = token;
        next();
    }
}