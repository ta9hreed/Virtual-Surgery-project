const express=require('express');
const mongoose = require ("mongoose");
const joi =require('joi');
//MRI SCAN Schema 
const MRIScanSchema = new mongoose.Schema({
     // Reference to Patient model
    Patient: 
    { 
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true

    },

    ScanDetalies:
    {
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:1000
    },
    Image:
    {
        type:String,
        required:true,
        trim:true,
        
    },
        
    
    

},{timestamps:true});


function validateCreateMRIScan(obj){
    const schema=joi.object
    ({
        Patient:joi.string().required(),
        ScanDetalies:joi.string().min(3).max(1000).required(),
        Image:joi.string().required()
    });
    return schema.validate(obj);
};
function validateUpdateMRIScan(obj){
    const schema=joi.object
    ({  
        Patient:joi.string(),
        ScanDetalies:joi.string().min(3).max(1000),
        Image:joi.string()
    
    });
    return schema.validate(obj);
};

const MRIScan= mongoose.model("MRIScan",MRIScanSchema);
module.exports = {
    MRIScan,
    validateCreateMRIScan,
    validateUpdateMRIScan
}


