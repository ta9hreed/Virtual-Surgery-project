const express=require('express');
const router= express.Router();
const {Photoupload} = require("../middlewares/photoUpload");
const{ verifytoken }=require("../middlewares/verifyToken");
const validateObjectId=require("../middlewares/validateObjectId")
const{getAllMRI,getMRIById,createNewMRI,updateMRI,deleteMRI,updateMRIImage}=require("../controller/mriController");
//http methods 

//api/
router.route('/').post(verifytoken,Photoupload.single( 'image' ), createNewMRI)
                .get(getAllMRI);

    //api/mriscan/:id
router.route("/:id")
    .get(validateObjectId,verifytoken,getMRIById)
    .put(validateObjectId,verifytoken,updateMRI)
    .delete(validateObjectId,verifytoken,deleteMRI);
    //api/mriscan/update-image/:id
    router.route("/update-image/:id").
    put(validateObjectId,verifytoken, Photoupload.single('newimage'), updateMRIImage);




module.exports=router;