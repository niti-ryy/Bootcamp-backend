const express = require('express');
const router=express.Router()
const {protect} = require("../middlewear/auth")

const {register, login ,getMe}=require("../controllers/auth")

router.post("/register",register)
router.post("/login",login)
router.post("/getMe",protect,getMe)

module.exports=router;