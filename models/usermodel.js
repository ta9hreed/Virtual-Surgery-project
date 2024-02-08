const mongoose =require('mongoose');
const joi=require('joi');
const jwt = require("jsonwebtoken");
const passwordComplexity=require("joi-password-complexity");
//user Schema 

const UserSchema = new mongoose.Schema({
    FristName:{
        type:String,
        required:true,
        minlength :3,
        maxlength:200,
    },
    LastName:{
        type:String,
        required:true,
        minlength : 3,
        maxlength:200,
    },
    UserName :{
        type:String,
        required:true,
        minlength : 3,
        maxlength:200,
        
    },
    Email:{
        type:String,
        required:true,
        minlength :5,
        maxlength:100,
        unique: true,
        trim:true
    },
    Age :{
        type:Number,
        required:true,
        minlength :0,
    },
    Gender:{
        type:String,
        required:true,
        minlength :4,
        maxlength:6,
    },
    Title:{
        type:String,
        required:true,
        minlength :3,
        maxlength:200,
    },
    Specialist:{
        type:String,
        required:true,
        minlength :3,
        maxlength:200,
    },
    IsAdmin:{
        type:Boolean,
        default:false
    },
    
    Password:{
        type:String,
        required:true,
        minlength :8,
        maxlength:100,
    }
},{timestamps:true});

//Generate Token
UserSchema.methods.generateToken = function(){
    return jwt.sign({_id:this._id,IsAdmin:this.IsAdmin},process.env.JWT_SECRET_KEY);

};






//validateRegister
function validateRegister(obj) {
    const schema = joi.object({
        
        FristName:joi.string().min(3).max(200).required(),
        LastName:joi.string().min(3).max(200).required(),
        UserName:joi.string().min(3).max(200).required(),
        Email : joi.string().trim().min(5).max(100).required().email(),
        Age:joi.number().required().min(0),
        Gender:joi.string().min(4).max(6).required(),
        Title:joi.string().min(3).max(200).required(),
        Specialist:joi.string().min(3).max(200).required(),
        IsAdmin:joi.bool(),
        Password:passwordComplexity().required(),
    });
    return schema.validate(obj);
};
//validateLogin
function validateLogin(obj){
    const schema = joi.object({
        Email : joi.string().trim().min(5).max(100).required().email(),
        Password:joi.string().min(8).max(100).required(),
    });
    return schema.validate(obj);
};
//validate change password
function validateChangePassword(obj){
    const schema = joi.object({
        
        Password:passwordComplexity().required(),
    });
    return schema.validate(obj);
}
//validateUpdate
function validateUpdate(obj) {
    const schema = joi.object({
        
        FristName:joi.string().min(3).max(200),
        LastName:joi.string().min(3).max(200),
        UserName:joi.string().min(3).max(200),
        Email : joi.string().trim().min(5).max(100).email(),
        Age:joi.number().min(0),
        Gender:joi.string().min(3).max(5),
        Title:joi.string().min(3).max(200),
        Specialist:joi.string().min(3).max(200),
        IsAdmin:joi.bool(),
        Password:passwordComplexity(),
    });
    return schema.validate(obj);
};
//validate model
const User = mongoose.model("User", UserSchema);

module.exports={
    User,
    validateRegister,
    validateLogin,
    validateUpdate,
    validateChangePassword
};
