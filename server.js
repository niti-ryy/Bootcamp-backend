
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors=require("colors")
const connectdb=require("./config/db")
const fileupload=require("express-fileupload")
const path = require("path")
const cookieParser = require("cookie-parser")

dotenv.config({ path: "./config/.env" });
connectdb()
const app = express();

//body parser
app.use(express.json())

//cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "DEVELOPMENT") {
    app.use(morgan("dev"));
}

// Middleware
const loggerMiddleware = require("./middlewear/logger");

//File Upload
app.use(fileupload())

//Set static folder
app.use(express.static(path.join(__dirname,"public")))


// Router files
const bootCampsRouter = require("./routes/bootcamps");
const coursesRouter = require("./routes/courses");
const authRouter = require("./routes/auth");

// Connect to DB
const connectDB = require("./config/db");

const errorHandler = require("./middlewear/errorHandler");

// Mount Routes
app.use(loggerMiddleware); // Use logger middleware
app.use("/api/v1/bootcamps", bootCampsRouter);
app.use("/api/v1/courses",coursesRouter)
app.use("/api/v1",authRouter)

app.use(errorHandler)




const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV;

const server=app.listen(PORT, () => {
    console.log(`Server is running in ${environment} environment and on port ${PORT}`.green);
});


//Handle Unhandled promise rejections
// process.on("unhandled rejections",(err,promise)=>{
//     console.log(`Error: ${err.message.red}`)
//     //close server and exit process
//     server.close(()=>{process.exit(1)})
// })


