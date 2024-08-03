const express=require("express")
const {getBootcamp,
    getBootcamps,
    deleteBootcamp,
    updateBootcamp,
    createBootcamp,
    getBootcampInRadius,
    getBootcampsInRadius,
    bootcampPhotoUpload,
    
    }=require("../controllers/bootcamps")

const Bootcamp=require("../models/Bootcamp")
const advanceResults=require("../middlewear/advancedresults")
const {protect , authorize} =require("../middlewear/auth")

//include other resource routers
const courseRouter=require("./courses")

    
const router=express.Router()

//Re-Route into other resource routers
router.use("/:bootcampId/courses",courseRouter)

router.route("/")
    .get(advanceResults(Bootcamp,"courses"),getBootcamps)
    .post(protect,createBootcamp)

router.route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(protect,authorize('creator'),deleteBootcamp)

router.route("/radius/:zipcode/:distance")
    .get(getBootcampsInRadius)

router.route("/:id/photo")
    .put(protect,bootcampPhotoUpload)

module.exports=router