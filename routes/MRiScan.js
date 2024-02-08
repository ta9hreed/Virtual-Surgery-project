const express=require('express');
const router= express.Router();
const asyncHandler = require("express-async-handler");

const{validateCreateMRIScan,validateUpdateMRIScan,MRIScan} = require("../models/MRimodel");

//http methods 

/** 
@desc Get all MRISCAN
@route /api/MRISCAN
@method GET
@access Public
notes
//comparioson  operator is used to filter out the data from database based on the given condition
//price:$eq:10//equal ,price:$ne:10//equal //not equal
//lt  : less than gt : greater than lte : less than or equals to   gte :
//in [9,10],nin:not in
*/ 

router.get("/",asyncHandler(async (req,res) => {
    
    const scans= await MRIScan.find({})
    .populate("Patient",["_id","FristName","LastName"]);
    res.status(200).json(scans);
} 
));

/** 
@desc Get MRIScan  by id
@route /api/MRIScan/:id
@method GET

@access Public

*/
router.get("/:id",asyncHandler(async(req,res)=>{

    const scans = await MRIScan.findById(req.params.id).populate("Patient");
    if(scans){
        res.status(200).json(scans);
    }
    else{
        res.status(404).json({message:'The MRIScan with the given ID was not found.'})
    }
}    

));


/** 
@desc add new MriSCAN
@route /api/patients
@method post
@access Public
*/
router.post("/",asyncHandler( async (req,res)=>{
    
    const {error}=validateCreateMRIScan(req.body);
    if (error) {
    res.status(400).send(error.details[0].message);
    }
    
        const scans = new MRIScan(
        {
            Patient:req.body.Patient,
            ScanDetalies:req.body.ScanDetalies,
            Image:req.body.Image
        
        })
        const result = await scans.save();
        res.status(201).json(result);
        
    
        
}
));






/** 
@desc update all MRISCAN
@route /api/MRISCAN/:id
@method put
@access Public
*/
router.put("/:id",asyncHandler(async(req,res)=> {
    const {error} = validateUpdateMRIScan(req.body);

    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }
    
        const scans =  await MRIScan.findByIdAndUpdate(req.params.id,{
            $set: {
                Patient : req.body.Patient,
                ScanDetalies : req.body.ScanDetalies,
                Image : req.body.Image
            }
    
        },{ new : true} );
        res.status(200).json(scans);
        
        
    
    
}
));

/** 
@desc delete all patients
@route /api/patients/:id
@method delete
@access Public
*/
router.delete("/:id",asyncHandler(async (req,res)=> {

    const mriscan = await MRIScan.findById(req.params.id);
    
        if(mriscan){
            await MRIScan.findByIdAndDelete(req.params.id);
            res.status(200).json({message : 'is delete'});
        }
        else{
            res.status(404).json({message:'The MRISCAN with the given ID was not found.'})
        }
        
    
}
));



module.exports=router;