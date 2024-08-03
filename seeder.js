const mongoose=require("mongoose")
const fs=require("fs")
const colors=require("colors")
require("dotenv").config({path:"./config/.env"})
const Bootcamp = require("./models/Bootcamp")
const Course = require("./models/Course")



//connect to db
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

//Read Json Files
const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/resources/_data/bootcamps.json`,"utf-8"))
const courses=JSON.parse(fs.readFileSync(`${__dirname}/resources/_data/courses.json`,"utf-8"))

//Imports to Db

const importsData=async()=>{
    try{
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        console.log("dataimported...".green.inverse)
        process.exit()
    }catch(e){
        console.log(e)
    }
}

//delete Data
const DeleteData=async()=>{
    
    try{
        await Bootcamp.deleteMany()
        await Course.deleteMany()

        console.log("datadeleted...".red.inverse)
        process.exit()
    }catch(e){
        console.log(e)
    }
}

if(process.argv[2]==="-i"){
    console.log(process.argv[2])
    importsData()
}else if(process.argv[2]==="-d"){
    DeleteData()
    console.log(process.argv[2])
}