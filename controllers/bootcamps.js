
//this can also be written as

const Bootcamp = require("../models/Bootcamp");
const errorHandler=require("../middlewear/errorHandler")
const ErrorResponse=require("../utils/errorResponse")
const asyncHandler=require("../middlewear/asynchandler")

// const bootCamp={}

// bootCamp.create=(req,res)=>{

// }

//@desc    GET single bootcamp
exports.getBootcamp=async(req,res,next)=>{
    const {id}=req.params
    try{
        const bootcamp=await Bootcamp.findById(id)
        if(!bootcamp){
        //     return res.status(401).json({
        //     message:`No bootcamp found with this Id-${id}`,
        //     success:false
        // })id
            return next(new ErrorResponse(`bootcamp not found with id ${id}`,404))
        }
        res.status(200).json({ success: true, data:bootcamp,message:"bootcamp fetched successfully" });
        
    }catch(err){
        // res.status(401).json({
        //     message:e.message,
        //     success:false
        // })
        // next(new ErrorResponse(e.message,400))
        next(err)
    } 
}

//@desch GET all bootcamps
exports.getBootcamps=asyncHandler(async(req,res,next)=>{
    const bootcamps=await Bootcamp.find()
    res.status(200).json({ success: true, data:bootcamps,message:"showing all bootcamps" });
})

//@desc UPDATE bootcamp
exports.updateBootcamp=asyncHandler(async(req,res,next)=>{
    const { id } = req.params; 
    const bootcamp=await Bootcamp.findByIdAndUpdate(id,req.body,{new:true,runValidators:true})
    if(!bootcamp){
        return next(new ErrorResponse(`bootcamp not found with id ${id}`,404))
    }
    res.status(200).json({ success: true, message: `updated boot camps data`,data:bootcamp }); 
})

//desc CREATE Bootcamp
exports.createBootcamp=asyncHandler(async(req,res,next)=>{
        console.log(req.body)
        const bootcamp=await Bootcamp.create(req.body); //Bootcamp.save(req.body)
        res.status(200).json({ success: true, data:"data",message:"bootcamp created successfully" });   
})

//@desc DELETE bootcamp
exports.deleteBootcamp=async(req,res,next)=>{
    const { id } = req.params;
    try{
        const bootcamp=await Bootcamp.findByIdAndDelete(id)
        if(!bootcamp){
            return next(new ErrorResponse(`bootcamp not found with id ${id}`,404))
        }
        res.status(200).json({ success: true, data: `deleted boot camps ${id}` });
    }catch(err){
        next(err)
    }
    
}

