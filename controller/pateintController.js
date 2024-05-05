const asyncHandler = require("express-async-handler");
const { Patient, validateCreatePatient, validateUpdatePatient } = require("../models/PatientModel");
const { MRIScan } = require("../models/MRimodel");

/**
@desc Get all patients
@route /api/patients
@method GET
@access Public
**/
module.exports.paginationPatients = asyncHandler(async (req, res) => {
    const patientPerPage = 3;
    const { pageNumber } = req.query;
    let PatientList;

    if (pageNumber) {
        PatientList = await Patient.find({ user: req.user.id })
            .skip((pageNumber - 1) * patientPerPage)
            .limit(patientPerPage)
            .populate("user", ["FristName", "LastName"], null, { virtuals: false })
            .sort({ createdAt: -1 });

    }
    else {
        PatientList = await Patient.find({ user: req.user.id })
            .populate("user", ["FristName", "LastName"]).sort({ createdAt: -1 });

    }
    res.status(200).json(PatientList);

});

//skip jump in first about number of write
//limit  limit the result by this number 2 print 2 items

/*module.exports.getAllPatient = asyncHandler(async (req, res) => {
    const patientPerPage = 3;
    const { pageNumber } = req.query;
    let PatientList;

    if (pageNumber) {
        PatientList = await Patient.find({ user: req.user.id })
            .skip((pageNumber - 1) * patientPerPage)
            .limit(patientPerPage)
            .populate("user", ["_id", "FristName", "LastName"]).sort({ createdAt: -1 });;

    }
    else {
        PatientList = await Patient.find({ user: req.user.id })
            .populate("user", ["_id", "FristName", "LastName"]).sort({ createdAt: -1 });

    }
    res.status(200).json(PatientList);

});
*/

/**
@desc Get  all patient 
@route /api/patients
@method GET
@access Public

*/
module.exports.getPatients = asyncHandler(async (req, res) => {



    const PatientList = await Patient.find({ user: req.user.id })
    //.populate("user", ["_id", "FristName", "LastName"]).sort({ createdAt: -1 });
    res.status(200).json(PatientList);
}

);

/**
@desc Get patients by id
@route /api/patients/:id
@method GET
@access Public

*/

module.exports.getPatientByID = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {

        res.status(404).json({ message: 'The patient with the given ID was not found.' })
    }
    if (req.user.id !== patient.user.toString()) {
        return res.status(403).json({ message: "access denied,forddien" });
    }

    else {
        await Patient.findById(req.params.id).
            populate("user", ["-Password"]);

        res.status(200).json(patient);
    }


}
);

/**
@desc add  patients
@route /api/patients
@method post
@access private in log in

*/
module.exports.addPatient = asyncHandler(async (req, res) => {

    const { error } = validateCreatePatient(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
    }

    const patient = await Patient.create({
        user: req.user.id,
        FristName: req.body.FristName,
        LastName: req.body.LastName,
        Age: req.body.Age,
        Gender: req.body.Gender,
        RiskFactorsAndLifeStyle: req.body.RiskFactorsAndLifeStyle,
        FamilyHistory: req.body.FamilyHistory,
        NeurologicalExam: req.body.NeurologicalExam,
        Symptoms: req.body.Symptoms,
        TreatmentHistory: req.body.TreatmentHistory,
        Allergies: req.body.Allergies,
        DurationAndProgressionOfSymptoms: req.body.DurationAndProgressionOfSymptoms,
        Diagnosis: req.body.Diagnosis,
        MedicalHistory: req.body.MedicalHistory,
        Notes: req.body.Notes,
        BiopsyOrPathologyResults: req.body.BiopsyOrPathologyResults,
        LabTestResult: req.body.LabTestResult,
        CurrentMedications: req.body.CurrentMedications,

    });

    res.status(201).json(patient);



});
/**
@desc update all patients
@route /api/patients/:id
@method put
@access Public

*/
module.exports.updatePatient = asyncHandler(async (req, res) => {
    const { error } = validateUpdatePatient(req.body);
    if (error) {
        res.status(400).json({ message: error.details[0].message });
    }
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
        res.status(404).json({ message: "patient not found" })
    }
    if (req.user.id !== patient.user.toString()) {
        return res.status(403).json({ message: "access denied,forddien" });
    }

    const updatepatient = await Patient.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                FristName: req.body.FirstName,
                LastName: req.body.LastName,
                Age: req.body.Age,
                Gender: req.body.Gender,
                RiskFactorsAndLifeStyle: req.body.RiskFactorsAndLifeStyle,
                FamilyHistory: req.body.FamilyHistory,
                NeurologicalExam: req.body.NeurologicalExam,
                Symptoms: req.body.Symptoms,
                TreatmentHistory: req.body.TreatmentHistory,
                Allergies: req.body.Allergies,
                DurationAndProgressionOfSymptoms: req.body.DurationAndProgressionOfSymptoms,
                Diagnosis: req.body.Diagnosis,
                MedicalHistory: req.body.MedicalHistory,
                Notes: req.body.Notes,
                BiopsyOrPathologyResults: req.body.BiopsyOrPathologyResults,
                LabTestResult: req.body.LabTestResult,
                CurrentMedications: req.body.CurrentMedications,



            }
        }, { new: true }).populate("user", ["-Passward"]);
    res.status(200).json(updatepatient);




});


/** 
@desc delete all patients
@route /api/patients/:id
@method delete
@access Public

*/

module.exports.deletePatients = asyncHandler(async (req, res) => {

    const patient = await Patient.findById(req.params.id);

    if (!patient) {

        res.status(404).json({ message: 'The patient with the given ID was not found.' })
    }
    if (req.user.IsAdmin || req.user.id === patient.user.toString()) {
        await Patient.findByIdAndDelete(req.params.id);
        await MRIScan.deleteMany({
            patientId: patient._id
        });
        res.status(200).json({
            message: 'is delete',
            patientId: patient._id
        });
    }
    else {
        res.status(403).json({ message: "access denied,forbidden" });
    }
}
);

/** 
@desc  count  patients
@route /api/patients/count
@method GET
@access Public

*/

module.exports.countPatients = asyncHandler(async (req, res) => {

    const count = await Patient.countDocuments();
    res.status(200).json(count);
}

);