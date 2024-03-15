const express=require('express');
const router= express.Router();
const{Photoupload}=require("../middlewares/photoUpload");
const asyncHandler = require('async-handler');
const path = require('path');


// /api/upload
router.post("/",Photoupload.single("image"),asyncHandler(async(req,res)=>{
//1.validation
    if(!req.file){
        return res.status(400).json({msg:"No file uploaded"});
    }
//2.get the path to the image
    const imagepath= path.join(__dirname,`../images/${req.file.filename}`);
//3.upload to  cloudinary 
const result = await cloudinaryUploadImage(imagepath);
console.log(result);

//4.get the user from Db
//5.Delete the old image 
//6.change the image filed in DB

})
    
)




module.exports=router;