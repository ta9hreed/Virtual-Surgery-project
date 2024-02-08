const asyncHandler = require("express-async-handler");
const{User,validateChangePassword} = require("../models/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer=require("nodemailer");
/**
 *  @desc    Get Forgot Password View
 *  @route   /password/forgot-password
 *  @method  GET
 *  @access  public 
 */

module.exports.getForgotPasswordView = asyncHandler((req,res) => {
    res.render('forgot-password');
});


/**
 *  @desc    Send Forgot Password Link
 *  @route   /password/forgot-password
 *  @method  POST
 *  @access  public 
 */
module.exports.sendForgotPasswordLink = asyncHandler(async(req,res) =>{
    const user = await User.findOne({email:req.body.Email});
    if(!user){
        return res.status(404).json({message:"user is not found"});
    }

    const secret = process.env.JWT_SECRET_KEY + user.Password;
    const token = jwt.sign({Email:user.Email, id:user.id}, secret,{
        expiresIn: '10m'
    });

    const link = `http://localhost:8000/password/reset-password/${user._id}/${token}`;

    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.USER_EMAIL,
            pass:process.env.USER_PASS,
        },
        tls:{
            rejectUnauthorized : false

        }
    });
    const mailOptions={
        from:process.env.USER_EMAIL,
        to:user.Email,
        subject:"Reset Password",
        html:`<div>
                <h4>click on the link below to rest Your password </h4>
                <p>${link}</p>
            </div>`

    }
    transporter.sendMail(mailOptions,function(error,success){
        if(error){
            console.log(error);
            return res.status(500).json({message:'there was an error in sending email'});
        }else{
            console.log("Email sent "+ success.response);
            res.render("link-send");
        }
    });
    

    // TO DO : Send email to the user
});


/**
 *  @desc    Get Reset Password View
 *  @route   /password/reset-password/:userId/:token
 *  @method  GET
 *  @access  public 
 */
module.exports.getResetPasswordView = asyncHandler(async(req,res) =>{
        const user = await User.findById(req.params.userId);
        if(!user){
        return res.status(404).json({message:"user is not found"});
        }
    
        const secret = process.env.JWT_SECRET_KEY + user.Password;
        try {
            jwt.verify(req.params.token, secret);
            res.render('reset-password', {Email:user.Email});
        } catch (error) {
            console.log(error);
            res.json({message: "Error"});
        }
    
});


/**
 *  @desc     Reset the Password 
 *  @route   /password/reset-password/:userId/:token
 *  @method  POST
 *  @access  public 
 */
module.exports.resetThePassword = asyncHandler(async(req,res) =>{
    //TO DO Validation
    const{error}= validateChangePassword(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if(!user){
        return res.status(404).json({message:"user is not found"});
    }
    
    const secret = process.env.JWT_SECRET_KEY + user.Password;
    try {
        jwt.verify(req.params.token,secret);
        const salt = await bcrypt.genSalt(10);
        req.body.Password = await bcrypt.hash(req.body.Password,salt);
        user.Password=req.body.Password;
        await user.save();
        res.render('success-password');
    } catch (error) {
        console.log(error);
        res.json({message: "Error"});
    }

});



