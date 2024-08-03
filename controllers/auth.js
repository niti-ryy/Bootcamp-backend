const errorHandler=require("../middlewear/errorHandler")
const ErrorResponse=require("../utils/errorResponse")
const asyncHandler=require("../middlewear/asynchandler");
const User=require("../models/User")


//@desc  Register User
//@route GET /api/v1/auth/register
//@access public

exports.register=asyncHandler( async(req, res, next) => {
    const {name,email,password,role}=req.body
    
    const user = await User.create({name,email,password,role})

    sendTokenResponse(user,200,res)
})

exports.login=asyncHandler( async(req, res, next) => {
    const  {email ,password} =req.body

    //check if email and password exists
    if(!email ||!password){
        return next(new ErrorResponse("Please provide email and password",400))
    }
    
    //check for user
    const user= await User.findOne({email}).select("+password")

    if(!user){
        return next(new ErrorResponse("Invalid email or password",401))
    }

    //check if password is correct
    const isMatch = await user.matchPassword(password)


    if(!isMatch){
        return next(new ErrorResponse("Invalid email or password",401))
    }
    
    sendTokenResponse(user,200,res)
})

//Get token form model,create cookie and send response
const sendTokenResponse = (user,statusCode,res) =>{
    //create token
    const token = user.getSignedJwtToken()

    const options={
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly:true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure=true
    }
    
    res.status(statusCode)
        .cookie("token",token,options)
        .json({
            success: true,
            token
        })


}

//@desc GET cuurent logged in user
//@route POST /api/v1/auht/me
//@access private

exports.getMe= asyncHandler(async (req, res) =>{
    const user= await User.findById(req.user.id).select("-password")
    console.log(user)
    res.json({success:true,data:user})
})