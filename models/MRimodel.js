const express = require('express');
const mongoose = require("mongoose");
const joi = require('joi');
//MRI SCAN Schema 
const MRIScanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    Patient: {
        type: String,
        required: true,
    },
    ScanDetails: {
        type: String,
        required: true,
    },
    Image: {
        url: {
            type: String,
            required: true,
        },
        publicId: {
            type: String,
            required: true,
        },
    },
    Prediction: {
        type: Array, // Adjust according to your prediction data structure
        required: true,
    },
}, { timestamps: true });



function validateCreateMRIScan(obj) {
    const schema = joi.object({
        Patient: joi.string().required(), // Change to string for ObjectId
        ScanDetalies: joi.string().min(3).max(1000),
        // Add any other validations as needed
    });
    return schema.validate(obj);
}

function validateUpdateMRIScan(obj) {
    const schema = joi.object({
        ScanDetalies: joi.string().min(3).max(1000),
        // Add any other validations as needed
    });
    return schema.validate(obj);
}


const MRIScan = mongoose.model("MRIScan", MRIScanSchema);
module.exports = {
    MRIScan,
    validateCreateMRIScan,
    validateUpdateMRIScan
}


