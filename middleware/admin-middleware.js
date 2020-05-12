const Jwt = require('jsonwebtoken');
const { AdminScrete } = require('../secure/secure');

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
        verifyAuth = Jwt.verify(token,AdminScrete);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    finally{
        if(!verifyAuth){
            const error = new Error('wrong Auth');
            error.statusCode = 500;
            throw error;
        }
        req.userIdAdmin = verifyAuth.userIdAd;
        req.adminToken = token;
        next();
    }
}