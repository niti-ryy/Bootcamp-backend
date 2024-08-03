
//this can also be written as

const Bootcamp = require("../models/Bootcamp");
const errorHandler=require("../middlewear/errorHandler")
const ErrorResponse=require("../utils/errorResponse")
const asyncHandler=require("../middlewear/asynchandler");
const geocoder = require("../utils/geoCoder");
const { json } = require("express");
const Course=require("../models/Course");
const path= require("path")  //node utility to work with file paths



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


exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advanceResults)
});

//@desc UPDATE bootcamps
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
        res.status(200).json({ success: true, data:bootcamp,message:"bootcamp created successfully" });   
})

// @desc DELETE bootcamp
exports.deleteBootcamp=asyncHandler(async(req,res,next)=>{
    const { id } = req.params;
        const bootcamp=await Bootcamp.findByIdAndDelete(id)
        const relatedCourse=await Course.deleteMany({bootcamp: id})
        if(!bootcamp){
            return next(new ErrorResponse(`bootcamp not found with id ${id}`,404))
        }
      
        res.status(200).json({ success: true, data: `deleted boot camps ${id}` ,relatedCourse});
       

})


//@desc GET Bootcamps with ceratin Radius

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params
  
    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude
  
    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;
  
    const bootcamps = await Bootcamp.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
  
    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    })
  })


  // @desc Upload photo-for bootcamp
  //@route PUT /api/v1/bootcamps/:id/photo
  // @access Private

// exports.bootcampPhotoUpload =asyncHandler(async(req,res,next)=>{
//     const { id } = req.params;
//         const bootcamp=await Bootcamp.findById(id)
       
//         if(!bootcamp){
//             return next(new ErrorResponse(`bootcamp not found with id ${id}`,404))
//         }

//         if(!req.files){
//             return next(new ErrorResponse(`please Upload a file`,404))
//         }

//         const file=req.files.file
//         console.log(req.files)

//         if (!file.mimetype==="image/jpg") {
//             return next(new ErrorResponse(`Please upload a valid file. It should only be in JPG/JPEG format`, 400));
//         }

//         if(file.size > process.env.MAX_FILE_UPLOAD){
//             return next(new ErrorResponse(`please Upload a file less than 5mb`,404))
//         }

//         // create custom filename
//         filename= `photo_${id}${path.parse(file.name).ext}`
//         console.log(path.parse)
//         console.log(req.files)
//         res.status(200).json({ success: true, data:""});
       

// })



exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Find the bootcamp by ID
    const bootcamp = await Bootcamp.findById(id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id ${id}`, 404));
    }

    // Check if files are present
    if (!req.files || !req.files.file) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Check file type
    const allowedFileTypes = ['image/jpeg', 'image/jpg'];
    if (!allowedFileTypes.includes(file.mimetype)) {
        return next(new ErrorResponse(`Please upload a valid file. It should be in JPG/JPEG format`, 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload a file smaller than 1mb`, 400));
    }

    // Create a custom filename
    const filename = `photo_${id}${path.parse(file.name).ext}`;
    console.log(filename)

    // Save the file to a specific directory or perform other actions
    // e.g., file.mv(`./uploads/${filename}`) for saving the file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${filename}`,async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    })

    console.log(file.name,filename)
    await Bootcamp.findByIdAndUpdate(id,{photo:filename})

    res.status(200).json({ success: true, data: `File uploaded successfully as ${filename}` });
});

  