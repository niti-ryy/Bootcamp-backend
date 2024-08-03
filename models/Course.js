const mongoose=require('mongoose')
const { dropSearchIndex } = require('./Bootcamp')


const courseSchema=new mongoose.Schema({
    title:{
        type : 'string',
        trim:true,
        required:[true, "please provide a title"]
    },
    description:{
        type:'string',
        required:[true, "please provide a description"]
    },
    weeks:{
        type:"string",
        required:[true, "please provide the number of weeks"]
    },
    tuition:{
        type:"number",
        required:[true, "please provide the tution fee"]
    },
    minimumSkill:{
        type:"string",
        required:[true, "please provide the minimum skill level required"],
        enum:["beginner","intermediate","advanced"]
    },
    scholarshipAvilable:{
        type:"boolean",
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    },

})

//Static method to get avg of course tutions
courseSchema.statics.getAverageCost=async function(bootcampId){
    

    const obj= await this.aggregate([
        {
            $match: {bootcamp:bootcampId}
        },
        {
            $group: {
                _id:"$bootcamp",
                averageCost:{ $avg :"$tuition"}   //used for calclating avg
            }
        }
    ])
    try{
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId,{
            averageCost: Math.ceil(obj[0].averageCost/10)*10  //to avoid and decimals
        })

    }catch(err){
        console.log(err)
    }
}

//Call getAvgCost after save
courseSchema.post("save",function(){
    this.constructor.getAverageCost(this.bootcamp)  //this.constructor is used when you want ot call satic method in a middlewear to acces we use that
})

//Call getAvgCost before save
// courseSchema.pre("save",async function(){
//     this.constructor.getAverageCost(this.bootcamp)
// })

module.exports = mongoose.model("Course",courseSchema)