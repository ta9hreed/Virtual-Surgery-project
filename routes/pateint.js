const express = require('express');
const router = express.Router();
const { getAllPatient, getPatientByID, countPatients, getPatients, updatePatient, addPatient, deletePatients ,paginationPatients} = require("../controller/pateintController");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifytoken, verifyTokenAndOnlyuser } = require("../middlewares/verifyToken")



//http methods 

router.route('/')
    .get(verifytoken, paginationPatients) // get all the data from database
    //.get(verifytoken, getPatients)


    .post(verifytoken, addPatient);
router.route('/count')
    .get(countPatients);
router.route('/:id')
    .get(validateObjectId, verifytoken, getPatientByID)
    .put(validateObjectId, verifytoken, updatePatient)
    .delete(validateObjectId, verifytoken, deletePatients);






module.exports = router;