const express=require('express');
const router= express.Router();
const asyncHandler = require("express-async-handler");
const bcrypt =require("bcryptjs");
const jwt = require("jsonwebtoken");
const{User,validateLogin,validateRegister,generateToken}=require("../models/usermodel");

/** 
@desc Register
@route /api/LogUser/register
@method POST
@access Public
*/ 
router.post("/register",asyncHandler(async(req,res)=>{
    const {error}=validateRegister(req.body);
    if (error) {
    return res.status(400).json({message:error.details[0].message});
    }
    let user = await User.findOne({email:req.body.Email});
    if(user){
        return res.status(400).json({message:"this user already registerted"});

    }
    const salt = await bcrypt.genSalt(10);
    req.body.Password= await bcrypt.hash(req.body.Password,salt);
    user = new User({
        FristName:req.body.FristName,
        LastName: req.body.LastName,
        UserName:req.body.UserName,
        Email:req.body.Email,
        Age:req.body.Age,
        Gender:req.body.Gender,
        Title:req.body.Title,
        Specialist:req.body.Specialist,
        IsAdmin:req.body.IsAdmin,
        Password:req.body.Password

    });
    const result =await user.save();
    const token = user.generateToken();
    const{Password, ...other}=result._doc;
    res.status(201).json({...other,token});

}));





/** 
@desc Login
@route /api/auth/Login
@method POST
@access Public
*/ 
router.post("/login",asyncHandler(async(req,res)=>{
    const {error}=validateLogin(req.body);
    if (error) {
    return res.status(400).json({message:error.details[0].message});
    }
    let user = await User.findOne({Email:req.body.Email});
    if(!user){
        return res.status(400).json({message:"invalid Email or Password"});

    }
    const isPasswordMatach = await bcrypt.compare(req.body.Password,user.Password);
    if(!isPasswordMatach){
    return res.status(400).json({message:"invalid Email or Password"});
    }
    const token = user.generateToken();
    const{Password, ...other}=user._doc;
    res.status(200).json({...other,token});

}));


module.exports=router;