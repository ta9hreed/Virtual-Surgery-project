const mongoose=require('mongoose');

module.exports = async()=>{
//connect mongo()
    try{
        await mongoose.connect(process.env.MONGO_URI)

        console.log(" connected to MongoDB ^_^");
    }catch(error){
        console.log(`connection is failed ${error}`);

    }
};
