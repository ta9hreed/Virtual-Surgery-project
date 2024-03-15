const asyncHandler = require("express-async-handler");
const {Patient,validateCreatePatient,validateUpdatePatient} =require("../models/PatientModel");


/**
@desc Get all patients
@route /api/patients
@method GET
@access Public

*/ 
//skip jump in first about number of write
//limit  limit the result by this number 2 print 2 items

module.exports.getAllPatient=asyncHandler(async(req,res)=>{
    const {pageNumber}=req.query;
    const patientPerPage=2;
    const PatientList=await Patient.find().skip((pageNumber-1)*patientPerPage).limit(patientPerPage)
    .populate("Sergeon",["_id","FristName","LastName"]);
    res.status(200).json(PatientList);
});


/**
@desc Get  all patient 
@route /api/patients
@method GET
@access Public

*/ 
module.exports.getPatients = asyncHandler(async(req,res)=>{

    const PatientList=await Patient.find()
    .populate("Sergeon",["_id","FristName","LastName"]);;
    res.status(200).json(PatientList);
}

);

/**
@desc Get patients by id
@route /api/patients/:id
@method GET
@access Public

*/

module.exports.getPatientByID=asyncHandler(async(req,res)=>{
    
    const patient= await Patient.findById(req.params.id).
    populate("Sergeon",["_id","FristName","LastName"]);;
if(patient){
    res.status(200).json(patient);
}
else{
    res.status(404).json({message:'The patient with the given ID was not found.'})
}
    

}
);

/**
@desc add all patients
@route /api/patients
@method post
@access Public

*/
module.exports.addPatient=asyncHandler( async (req,res)=>{
    
    const {error}=validateCreatePatient(req.body);
        if (error) {
        res.status(400).send(error.details[0].message);
        }
        
            const patient=new Patient({
                Sergeon:req.body.Sergeon,
                FristName:req.body.FristName,
                LastName:req.body.LastName,
                Age:req.body.Age,
                Gender:req.body.Gender,
                RiskFactorsAndLifeStyle:req.body.RiskFactorsAndLifeStyle,
                FamilyHistory:req.body.FamilyHistory,
                NeurologicalExam:req.body.NeurologicalExam,
                Symptoms:req.body.Symptoms,
                TreatmentHistory:req.body.TreatmentHistory,
                Allergies:req.body.Allergies,
                DurationAndProgressionOfSymptoms:req.body.DurationAndProgressionOfSymptoms,
                Diagnose:req.body.Diagnose,
                MedicalHistory:req.body.MedicalHistory,
                Notes:req.body.Notes,
                BiopsyOrPathologyResults:req.body.BiopsyOrPathologyResults,
                LabTestResult:req.body.LabTestResult,
                CurrentMedications:req.body.CurrentMedications,
                
            });
            const result =await patient.save();
            res.status(201).json(result);
            
    
        
    });
    /**
@desc update all patients
@route /api/patients/:id
@method put
@access Public

*/
module.exports.updatePatient=asyncHandler(async(req,res)=> {
    const {error}= validateUpdatePatient(req.body);
    if (error) {
        res.status(400).json({message:error.details[0].message});
    }
    
        const patient =  await Patient.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    Sergeon:req.body.Sergeon,
                    FristName:req.body.FirstName,
                    LastName:req.body.LastName,
                    Age: req.body.Age ,
                    Gender: req.body.Gender ,
                    RiskFactorsAndLifeStyle:req.body.RiskFactorsAndLifeStyle,
                    FamilyHistory:req.body.FamilyHistory,
                    NeurologicalExam:req.body.NeurologicalExam,
                    Symptoms:req.body.Symptoms,
                    TreatmentHistory:req.body.TreatmentHistory,
                    Allergies:req.body.Allergies,
                    DurationAndProgressionOfSymptoms:req.body.DurationAndProgressionOfSymptoms,
                    Diagnose:req.body.Diagnose,
                    MedicalHistory:req.body.MedicalHistory,
                    Notes:req.body.Notes,
                    BiopsyOrPathologyResults:req.body.BiopsyOrPathologyResults,
                    LabTestResult:req.body.LabTestResult,
                    CurrentMedications:req.body.CurrentMedications,
            
                
        
                }
    
        },{new:true}
        );
        res.status(200).json(patient);
        
        
    
        
});


/** 
@desc delete all patients
@route /api/patients/:id
@method delete
@access Public

*/

module.exports.deletePatients  =asyncHandler(async (req,res)=> {

    const patient = await Patient.findById(req.params.id);

        if(patient){
            await Patient.findByIdAndDelete(req.params.id);
            res.status(200).json({message : 'is delete'});
        }
        else{
            res.status(404).json({message:'The patient with the given ID was not found.'})
        }
    }
);

