const express=require('express');
const router= express.Router();
const {Photoupload} = require("../middlewares/photoUpload");
const{getAllMRI,getMRIById,createNewMRI,updateMRI,deleteMRI,updateMRIImage}=require("../controller/mriController");
//http methods 

//api/
router.route('/').post(Photoupload.single( 'image' ), createNewMRI)
                .get(getAllMRI);

    //api/mriscan/:id
router.route("/:id")
    .get(getMRIById)
    .put(updateMRI)
    .delete(deleteMRI);
    //api/mriscan/update-image/:id
    router.route("/update-image/:id").
    put( Photoupload.single('newimage'), updateMRIImage);




module.exports=router;