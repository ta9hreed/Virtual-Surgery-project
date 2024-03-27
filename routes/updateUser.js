const express=require('express');
const router= express.Router();
const {verifyTokenAndAuthorization,verifyTokenAndAdmin, verifytoken}=require("../middlewares/verifyToken");
const validateObjectId=require("../middlewares/validateObjectId");
const{Photoupload}=require("../middlewares/photoUpload")
const{updateuser,getAllUsers,getUserById,deleteUser,getUserscount,profilePhotoUpload}=require("../controller/userController");



router.route("/").get(verifyTokenAndAdmin ,getAllUsers);

router.get("/count",verifyTokenAndAdmin,getUserscount);
router.route("/:id")
        .put(validateObjectId,verifyTokenAndAuthorization,updateuser)
        .get(validateObjectId,verifyTokenAndAuthorization ,getUserById)
        .delete(validateObjectId,verifyTokenAndAuthorization,deleteUser);
router.route("/profile-photo-upload")
        .post(verifytoken,Photoupload.single("image") ,profilePhotoUpload);

module.exports=router;