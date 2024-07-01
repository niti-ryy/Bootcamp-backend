const ErrorResponse = require("../utils/errorResponse")

const errorHandler=(err,req,res,next)=>{
    //create a copy of error class or object and put it in a new variable error
    let error={...err}
    error.message=err.message

    console.log(err)
    console.log(err.name,err.value)
    //Bad request or wrong formatted ID
    if(err.name==="CastError"){
        const message=`bootcamp not found with id ${err.value}`
        error=new ErrorResponse("resource not found",404)
    }
    //mongoose duplicate key
    if(err.code===11000){
        const message="Duplicate field value entered"
        error=new ErrorResponse(message,400)
    }

    if(err.name==="ValidationError"){
        const message=Object.values(err.errors).map(val=>val.message)
        error=new ErrorResponse(message,400)
    }

    res.status(error.statusCode || 500).json({

        success:false,
        error:error.message || "server error"
    })
}

module.exports=errorHandler