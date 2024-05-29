const express = require('express');

const router = express.Router();
//const { upload } = require("../middlewares/upload_nii");
//const { Photoupload } = require("../middlewares/photoUpload");
const { verifytoken } = require("../middlewares/verifyToken");
//const validateObjectId = require("../middlewares/validateObjectId")
//const { getAllMRI, getMRIById, handleFileUpload, updateMRI, deleteMRI, updateMRIImage, deleteMRIs } = require("../controller/mriController");
//http methods 
const { handleFileUpload } = require('../controller/mriController');
const multer = require("multer");


//router.route("/new").post(verifytoken, upload, handleFileUpload);
////////////////


/////////////////
//router.route("/").get(verifytoken, getAllMRI);
////////////////////////
//
//router.route("/").post(verifytoken, upload.single("image"), createNewMRI);
//
//api/
//router.route("/").get(getAllMRI);


// router.route("/delete-images")
//     .delete(verifytoken, deleteMRIs);



// //api/mriscan/:id
// router.route("/:id")
//     //.get(validateObjectId, verifytoken, getMRIById)
//     .put(validateObjectId, verifytoken, updateMRI)
//     .delete(validateObjectId, verifytoken, deleteMRI);


// //api/mriscan/update-image/:id
// router.route("/update-image/:id").
//     put(validateObjectId, verifytoken, Photoupload.single('newimage'), updateMRIImage);




module.exports = router;