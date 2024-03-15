const express=require('express');
const router= express.Router();
const{register,login}=require("../controller/authController");

//api/logUser/register

router.post("/register",register);
//api/logUser/login
router.post("/login",login)



module.exports=router;