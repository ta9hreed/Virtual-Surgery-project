const express=require('express');
const router= express.Router();
const{getAllPatient,getPatientByID,countPatients,getPatients,updatePatient,addPatient,deletePatients}=require("../controller/pateintController");
const validateObjectId=require("../middlewares/validateObjectId");
const{verifytoken}=require("../middlewares/verifyToken")



//http methods 

router.route( '/' )
    .get(getAllPatient) // get all the data from database
    .get(getPatients)
    .post(verifytoken,addPatient);
    router.route( '/count' )
    .get(countPatients);
router.route( '/:id' )
.get(validateObjectId,getPatientByID)
.put(validateObjectId,verifytoken,updatePatient)
.delete(validateObjectId,verifytoken,deletePatients);






module.exports=router;