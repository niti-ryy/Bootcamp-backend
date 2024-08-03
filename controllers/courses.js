const errorHandler=require("../middlewear/errorHandler")
const ErrorResponse=require("../utils/errorResponse")
const asyncHandler=require("../middlewear/asynchandler");
const Course = require("../models/Course")
const Bootcamp = require("../models/Bootcamp");
// @desc    Get all courses
// @access   Public
//@route     GET  /api/v1/courses
//@route     GET  /api/v1/bootcamps/:bootcampId/courses

exports.getCourses=asyncHandler(async(req,res,next)=>{
   
    if(req.params.bootcampId){
        const courses=Course.find({bootcamp:req.params.bootcampId})
        
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })

    }else{
        res.status(200).json(res.advanceResults)
    }
    
})

// @desc    Get Single courses
// @access   Public
//@route     GET  /api/v1/courses
//@route     GET  /api/v1/courses/:id

exports.getCourse=asyncHandler(async(req,res,next)=>{
    const course = await Course.findById(req.params.id).populate({path:"bootcamp",select:"name description"})

    if(!course){
        return next(new ErrorResponse(`No course found with id ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: course });
})

// @desc    Add  course
// @access   Private
//@route     POST  /api/v1/bootcamps/:bootcampId/courses

exports.addCourse=asyncHandler(async(req,res,next)=>{
    req.body.bootcamp=req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp found with id ${req.params.bootcampId}`, 404))
    }
    const course=await Course.create(req.body);
    res.status(201).json({ success: true, data: course, message:"Course added successfully" });
})

// @desc    Update  course
// @access   Private
//@route     POST  /api/v1/courses/:courseId(id)
exports.updateCourse=asyncHandler(async(req,res)=>{
    const {id} = req.params

    let course = await Course.findById(id)
    if(!course){
        return next(new ErrorResponse(`No course found with id ${courseId}`, 404))
    }

    course=await Course.findByIdAndUpdate(id,req.body,{new:true, runValidators: true})

    res.status(200).json({ success: true, data: course, message:"Course updated successfully" });
   
})


// @desc    delete  course
// @access   Private
//@route     POST  /api/v1/courses/:courseId-id

exports.deleteCourse=asyncHandler(async(req,res)=>{
    const {id} = req.params

    let course = await Course.findById(id)
    if(!course){
        return next(new ErrorResponse(`No course found with id ${courseId}`, 404))
    }

    course=await Course.findByIdAndDelete(id)

    res.status(200).json({ success: true, data: course, message:"Course Deleted  successfully" });
   
})