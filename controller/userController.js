const asyncHandler = require("express-async-handler");
const bcrypt =require("bcryptjs");

const{User,validateUpdate}=require("../models/usermodel");

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


module.exports.getUseById=asyncHandler(async(req,res) =>{
    const user =await User.findById(req.params.id).select("-Password");
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
    if(user){
        await User.findByIdAndDelete(req.params.id);
    res.status(200).json({msg:"user has been deleted.."});
    }else{
        return res.status(404).json({msg:"user not found"});
        }

});