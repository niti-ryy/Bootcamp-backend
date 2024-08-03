const express = require('express')
const {getCourses, getCourse,addCourse, updateCourse,deleteCourse } = require("../controllers/courses")

const router=express.Router({mergeParams: true})
const {protect ,authorize}=require("../middlewear/auth")

//middleware
const advancedresults = require("../middlewear/advancedresults")
const Course=require("../models/Course")

router.route("/")
    .get(advancedresults(Course,),getCourses)
    .post(protect,authorize('creator'),authorize('creator'),addCourse)
    
router.route("/:id")
    .get(getCourse)
    .put(protect,authorize('creator'),updateCourse)
    .delete(protect,authorize('creator'),deleteCourse)
    

module.exports=router