const mongoose =require('mongoose');
const joi=require('joi');
const PatientSchema = new mongoose.Schema({
     // Reference to Patient model
    Sergeon: 
    { 
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true

    },
    FristName:{
        type : String,
        minlength :3,
        maxlength:200,
        required: true 
    },
    LastName:{
        type:String,
        minlength : 3,
        maxlength:200,
        required: true 
    }, 
    Age :{
        type:Number,
        minlength :0,
        required: true 
    },
    Gender:{
        type:String,
        minlength : 4,
        maxlength:6,
        required: true ,
    },
    RiskFactorsAndLifeStyle:{
        type:String,
        trim:true,
        maxlength:1000,
        
    },
    FamilyHistory:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    NeurologicalExamination:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Symptoms:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    TreatmentHistory:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Allergies:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    DurationAndProgressionOfSymptoms:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Diagnosis:{
        type:String,
        trim:true,
        maxlength:1000,
            

    },
    MedicalHistory:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    Notes:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    BiopsyOrPathologyResults:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    LabTestResult:{
        type:String,
        trim:true,
        maxlength:1000,
    },
    CurrentMedications:{
        type:String,
        trim:true,
        maxlength:1000,

    }
    

    

},
{ timestamps:true}
);
function validateCreatePatient(obj){
    const schema = joi.object
    ({
        Sergeon:joi.string() .required(),
        FristName:joi.string().min(3).max(200).required(),
        LastName:joi.string().min(3).max(200).required(),
        Age:joi.number().min(0).integer().required(),
        Gender:joi.string().min(4).max(6).required(),
        RiskFactorsAndLifeStyle:joi.string().min(3).max(1000),
        FamilyHistory:joi.string().min(3).max(1000),
        NeurologicalExam:joi.string().min(3).max(1000),
        Symptoms:joi.string().min(3).max(1000),
        TreatmentHistory:joi.string().min(3).max(1000),
        Allergies:joi.string().min(3).max(1000),
        DurationAndProgressionOfSymptoms:joi.string().min(3).max(1000),
        Diagnose:joi.string().min(3).max(1000),
        MedicalHistory:joi.string().min(3).max(1000),
        Notes:joi.string().min(3).max(1000),
        BiopsyOrPathologyResults:joi.string().min(3).max(1000),
        LabTestResult:joi.string().min(3).max(1000),
        CurrentMedications:joi.string().min(3).max(1000),
        
        
        
        
    });
    return schema.validate(obj);
};
function validateUpdatePatient(obj){
    const schema=joi.object
    ({  Sergeon:joi.string(),
        FristName:joi.string().min(3).max(200),
        LastName:joi.string().min(3).max(200),
        Age:joi.number().min(0).integer(),
        Gender:joi.string().min(4).max(6),
        RiskFactorsAndLifeStyle:joi.string().min(3).max(1000),
        FamilyHistory:joi.string().min(3).max(1000),
        NeurologicalExam:joi.string().min(3).max(1000),
        Symptoms:joi.string().min(3).max(1000),
        TreatmentHistory:joi.string().min(3).max(1000),
        Allergies:joi.string().min(3).max(1000),
        DurationAndProgressionOfSymptoms:joi.string().min(3).max(1000),
        Diagnose:joi.string().min(3).max(1000),
        MedicalHistory:joi.string().min(3).max(1000),
        Notes:joi.string().min(3).max(1000),
        BiopsyOrPathologyResults:joi.string().min(3).max(1000),
        LabTestResult:joi.string().min(3).max(1000),
        CurrentMedications:joi.string().min(3).max(1000),
        
        

    });
    return schema.validate(obj);
};
const Patient= mongoose.model("Patient",PatientSchema);
module.exports = {
    Patient,
    validateCreatePatient,
    validateUpdatePatient  
    
    

};