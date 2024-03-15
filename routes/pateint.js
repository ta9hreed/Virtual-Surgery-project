const express=require('express');
const router= express.Router();
const{getAllPatient,getPatientByID,getPatients,updatePatient,addPatient,deletePatients}=require("../controller/pateintController");





//http methods 

router.route( '/' )
    .get(getAllPatient) // get all the data from database
    .get(getPatients)
    .post(addPatient);

router.route( '/:id' )
.get(getPatientByID)
.put(updatePatient)
.delete(deletePatients);






module.exports=router;