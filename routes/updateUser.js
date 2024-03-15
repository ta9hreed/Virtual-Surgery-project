const express=require('express');
const router= express.Router();
const {verifyTokenAndAuthorization,verifyTokenAndAdmin}=require("../middlewares/verifyToken");
const{updateuser,getAllUsers,getUseById,deleteUser}=require("../controller/userController");



router.get("/",verifyTokenAndAdmin ,getAllUsers);

router.route("/:id")
        .put(verifyTokenAndAuthorization,updateuser)
        .get(verifyTokenAndAuthorization ,getUseById)
        .delete(verifyTokenAndAuthorization,deleteUser);


module.exports=router;