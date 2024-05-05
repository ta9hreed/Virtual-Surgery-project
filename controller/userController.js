const asyncHandler = require("express-async-handler");
const bcrypt =require("bcryptjs");
const mongoose=require("mongoose");
const path= require("path");
const{User,validateUpdate}=require("../models/usermodel");
const{Patient}=require("../models/PatientModel");
const{MRIScan}=require("../models/MRimodel");
const{cloudinaryUploadImage,cloudinaryRemoveImage,cloudinaryRemoveMultipleImage}=require("../utils/cloudinary")
const fs =require("fs");
//
/** 
@desc update
@route /api/Users/
@method Put
@access private
*/
module.exports.updateuser=asyncHandler(async(req,res)=>{

    
    const{error}=validateUpdate(req.body);
    if(error){
        res.status(400).json({message:error.details[0].message});
    }

    if(req.body.Password){
        const salt = await bcrypt.genSalt(10);
        req.body.Password= await bcrypt.hash(req.body.Password,salt);
    }
    const updateUser=await User.findByIdAndUpdate(req.params.id,
        {
            $set:{
                FristName:req.body.FristName,
                LastName: req.body.LastName,
                UserName:req.body.UserName,
                Email:req.body.Email,
                Age:req.body.Age,
                Gender:req.body.Gender,
                Title:req.body.Title,
                Specialist:req.body.Specialist,
                Password:req.body.Password
                
            }

        },{new:true}).select("-Password");
    res.status(200).json(updateUser);


});

/** 
@desc get all Users(only admin)
@route /api/Users/
@method get
@access private
*/
module.exports.getAllUsers=asyncHandler(async(req,res) =>{
    const users =await User.find().select("-Password");
    res.status(200).json(users);

});

/** 
@desc get user by ID
@route /api/Users/:id
@method get
@access private(only Admin & user himself)
*/


module.exports.getUserById=asyncHandler(async(req,res) =>{
    const user =await User.findById(req.params.id).select("-Password").populate("Patients");
    if(user){
    res.status(200).json(user);
    }else{
        return res.status(404).json({msg:"user not found"});
        }

});

/** 
@desc Delete user by
@route /api/Users/:id
@method DELETE
@access private(only Admin & user himself)
*/

module.exports.deleteUser = asyncHandler(async(req,res) =>{
    const user =await User.findById(req.params.id).select("-Password");
    if(!user){
        return res.status(404).json({msg:"user not found"});
        }
        
        //get all patients about this
        const mriscans=await MRIScan.find({user:user._id});
        //get the public ids from mriscans
        const publicIds =mriscans?.map((mriscan)=>mriscan.Image.publicId);
        //remove images in cloudinary
        if(publicIds?.length > 0){
            await cloudinaryRemoveMultipleImage(publicIds);
        }
        
        await cloudinaryRemoveImage(user.ProfilePhoto.publicId); 
        // delete all patients and mriscans 
        await Patient.deleteMany({ user :user._id});
        await MRIScan.deleteMany({ user :user._id});
        //
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({msg:"user has been deleted.."});
});


/** 
@desc get Users count(only admin)
@route /api/Users/count
@method get
@access private
*/
module.exports.getUserscount=asyncHandler(async(req,res) =>{
const count = await User.countDocuments();
    res.status(200).json(count);

});

/** 
@desc profile photo upload
@route /api/Users/profile-photo-upload
@method POST
@access private (only logged in)
*/
module.exports.profilePhotoUpload=asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:'no file provided'});
    };
    //3.upload photo
    const imagePath=path.join(__dirname,`../images/${req.file.filename}`);

    const result = await cloudinaryUploadImage(imagePath);
    console.log(result);

    //4.create 
    const user = await User.findById(req.user.id);
    if(user.ProfilePhoto && user.ProfilePhoto.publicId !== null)  {
        await cloudinaryRemoveImage(user.ProfilePhoto.publicId);
    }    
    user.ProfilePhoto={
                url:result.secure_url,
                publicId:result.public_id,
    }
    await user.save();
    res.status(200).
    json({
        message:"is already profile photo uploaded",
        ProfilePhoto:{
                url:result.secure_url,
                publicId:result.public_id,
    }
    
});
    //6. remove image from the server
        fs.unlinkSync(imagePath);


})