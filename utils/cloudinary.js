require('dotenv').config(); 

const cloudinary = require('cloudinary').v2; 

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    //secure:true,
    
});

const fs = require('fs');
// Cloudinary upload image
const cloudinaryUploadImage = async (fileToUpload) => {
    try {
        // Check if the file exists
        if (!fs.existsSync(fileToUpload)) {
            throw new Error('File does not exist');
        }

        // Upload the file to Cloudinary
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: 'auto',
        });

        return data;
    } catch (error) {
        return error;
    }
};



//cloudinary upload image
/*const cloudinaryUploadImage= async (fileToUpload)=>{
    try {
        const data = await cloudinary.uploader.upload(fileToUpload,{
            resource_type:'auto',
        });
        return data;
    } catch (error) {
        return error;
        
    }
}*/

//cloudinary remove image
const cloudinaryRemoveImage= async (imagePublicId)=>{
    try {
        const result =await cloudinary.uploader.destroy(imagePublicId);
            
        return result;
    } catch (error) {
        return error;
        
    }
}
//cloudinary remove Multiple image
const cloudinaryRemoveMultipleImage= async (PublicIds)=>{
    try {
        const result =await cloudinary.v2.api.delete_resources(PublicIds);
            
        return result;
    } catch (error) {
        return error;
        
    }
}


module.exports={
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage
}