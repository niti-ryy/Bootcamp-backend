
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors=require("colors")
const connectdb=require("./config/db")

dotenv.config({ path: "./config/.env" });
connectdb()
const app = express();

//body parser
app.use(express.json())

// Middleware
const loggerMiddleware = require("./middlewear/logger");



// Router files
const bootCampsRouter = require("./routes/bootcamps");
const connectDB = require("./config/db");
const errorHandler = require("./middlewear/errorHandler");

// Mount Routes
app.use(loggerMiddleware); // Use logger middleware
app.use("/api/v1/bootcamps", bootCampsRouter);
app.use(errorHandler)


// Dev logging middleware
if (process.env.NODE_ENV === "DEVELOPMENT") {
    app.use(morgan("dev"));
}

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
