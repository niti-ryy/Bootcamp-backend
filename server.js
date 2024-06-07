const express=require("express")
const dotenv=require("dotenv").config()

const app=express()
const PORT=process.env.PORT || 5000

app.listen(PORT, console.log(`server is running ${process.env.NODE_ENV} environment  and on port ${PORT}`))