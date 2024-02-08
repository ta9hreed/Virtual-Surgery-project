const {MRIScan}=require("./models/MRimodel");
const {Patient}=require("./models/PatientModel");
const {MRIScans,patients}=require("./data");
const connectToDB=require("./config/db");
require("dotenv").config();


//connection DB
connectToDB();
//Import MRISCANS
const   importMriScans= async()=>{
    try {
        
        await MRIScan.insertMany(MRIScans);
        console.log('Data imported to the database');
    } catch (error) {
        console.log(error);
        process.exit(1);//entrupted connection server 

    }
}
//remove MRISCANS
const   removeMriScans= async()=>{
    try {
        
        await MRIScan.deleteMany();
        console.log('Data removed to the database');
    } catch (error) {
        console.log(error);
        process.exit(1);//entrupted connection server 
    
    }
};
const importpatients= async()=>{
    try {
        
        await Patient.insertMany(patients);
        console.log('Data imported to the database');
    } catch (error) {
        console.log(error);
        process.exit(1);//entrupted connection server 

    }
}
if (process.argv[2]==='-import'){
    importMriScans();
    }else if(process.argv[2]=== '-remove'){
    removeMriScans();
    }
    else if(process.argv[2] === "-import-patients"){
        importpatients();
    }
    