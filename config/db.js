const mongoose=require("mongoose")


const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
        console.log(`DB connected successfully: ${conn.connection.host}`.cyan.underline.bold)
    }catch(e){
        console.log(e)
    }
    
}

module.exports=connectDB