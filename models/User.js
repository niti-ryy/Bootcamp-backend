const { reset } = require('colors')
const mongoose = require('mongoose')
const bcrypt = require( "bcryptjs")
const Schema=mongoose.Schema
const jwt = require("jsonwebtoken")

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    role : {
        type: String,
        enum: ['user', 'creator'],
        required: [true],
        default: 'user',
      
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

//Encrypt password using bcrypt
UserSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

//Sign JWT and return
UserSchema.methods.getSignedJwtToken= function (){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}

//Match user entered password to hased password in db
UserSchema.methods.matchPassword=async function(enterdPassword){
    return await bcrypt.compare(enterdPassword , this.password)
}


module.exports = mongoose.model("User",UserSchema)