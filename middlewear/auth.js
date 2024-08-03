const jwt = require("jsonwebtoken");
const asyncHandler=require("./asynchandler")
const ErrorResponse= require("../utils/errorResponse")
const User=require("../models/User")

//Protect Routes

exports.protect=asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // else if(req.cookies){
    //     token=req.cookies.token
    // }
    //Make sure token exists 
    if(!token){
        return next(new ErrorResponse('Not authorized to access this route',401))
    }

    try{
        //verify token
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded)

    req.user= await User.findById(decoded.id)

     
    next()

    }catch(e){
        return next(new ErrorResponse('Token expired',401))
    }
})

//authroized route

exports.authorize = (...roles) => {
    
    return (req, res, next) => {
        console.log(req.user);
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse('Unauthorized to access this route', 403));
        }
        next();
    };
};
