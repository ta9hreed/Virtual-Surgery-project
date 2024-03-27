const jwt = require("jsonwebtoken");

function verifytoken(req,res,next){
    const token =req.headers.token;
    if(token){
        // const token =req.headers.split(" ")[1];
        try {
            const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user= decoded;
            next();


        } catch (error) {
            res.status(401).json("invalid token,access denied ");
        }

    }
    else{
        res.status(401).json("no token provided ");
    }

};

//verifyToken& Authorthize the sergeon
function verifyTokenAndAuthorization(req,res,next){
    verifytoken(req,res,()=>{
        if(req.user.id === req.params.id ||req.user.IsAdmin){
            next();
        }
        else{
            res.status(403).json("this is not allowed");
        }
})};
//verifyToken And Admin
function verifyTokenAndAdmin(req,res,next){
    verifytoken(req,res,()=>{
        if(req.user.IsAdmin){
            next();
        }
        else{
            res.status(403).json("this is not allowed ,only Admin");
        }
    })};
//verifyToken And Admin
function verifyTokenAndOnlyuser(req,res,next){
    verifytoken(req,res,()=>{
        if(req.user.id===req.params.id){
            next();
        }
        else{
            res.status(403).json("this is not allowed ,only user himself");
        }
    })};



module.exports={
    verifytoken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyuser
}