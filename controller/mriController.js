const asyncHandler = require("express-async-handler");
const path = require('path');
const fs = require("fs");
const { uploadToCloudinary, cloudinaryRemoveImage, cloudinaryRemoveMultipleImage } = require("../utils/cloudinary")
const { validateCreateMRIScan, validateUpdateMRIScan, MRIScan } = require("../models/MRimodel");
const { required } = require("joi");
const axios = require('axios');
//const { loadModel, applyModel } = require('../utils/loadModel');
const sharp = require('sharp');
const multer = require('multer');
// Multer configuration for handling file uploads
const zlib = require('zlib');
const FormData = require('form-data');


module.exports.handleFileUpload = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded');
        }

        // Compress the uploaded files
        const compressedFiles = await Promise.all(req.files.map(async (file) => {
            // Compress the file using zlib
            const compressedBuffer = zlib.deflateSync(file.buffer);
            return { originalname: file.originalname, buffer: compressedBuffer };
        }));

        // Send compressed files to Flask API for uncompression and prediction
        const formData = new FormData();
        compressedFiles.forEach((file, index) => {
            formData.append(`file${index}`, file.buffer, file.originalname);
            console.log(file.buffer);
        });

        const flaskResponse = await axios.post('http://localhost:5000/uncompress-and-predict', formData, {
            headers: {
                ...formData.getHeaders()
            }

        });
        console.log(flaskResponse);

        // Get response from Flask API
        const predictions = flaskResponse.data;
        console.log(flaskResponse);
        // Check if the response contains errors
        if (flaskResponse.data.error) {
            return res.status(500).send('Flask API Error: ' + flaskResponse.data.error);
        }
        console.log(flaskResponse.data.error);
        // Upload prediction results to Cloudinary
        const cloudinaryResponses = await Promise.all(predictions.map(async (prediction, index) => {
            const resultBuffer = Buffer.from(prediction.result, 'base64');
            const cloudinaryResponse = await cloudinaryUpload(resultBuffer);
            return {
                filename: prediction.filename,
                prediction: prediction.prediction,
                cloudinary: cloudinaryResponse
            };
        }));
        console.log(cloudinaryResponses);

        // Send response to the client
        res.status(201).json(cloudinaryResponses);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
};

// module.exports.handleFileUpload = async (req, res) => {
//     try {
//         if (!req.files || req.files.length === 0) {
//             return res.status(400).send('No files uploaded');
//         }

//         // Compress the uploaded files
//         const compressedFiles = await Promise.all(req.files.map(async (file) => {
//             const compressedBuffer = zlib.deflateSync(file.buffer);
//             return { originalname: file.originalname, buffer: compressedBuffer };
//         }));

//         // Prepare form data to send to Flask API
//         const formData = new FormData();
//         compressedFiles.forEach((file, index) => {
//             formData.append(`file${index}`, file.buffer, file.originalname);
//         });

//         // Log FormData for debugging
//         const formDataStream = formData.getBuffer();
//         fs.writeFileSync('formDataStream.bin', formDataStream); // Save FormData to a file for inspection

//         // Send the form data to Flask API
//         const flaskResponse = await axios.post('http://localhost:5000/uncompress-and-predict', formData, {
//             headers: formData.getHeaders()
//         });

//         // Handle the response from Flask API
//         const predictions = flaskResponse.data;
//         if (predictions.error) {
//             return res.status(500).send('Flask API Error: ' + predictions.error);
//         }

//         // Upload prediction results to Cloudinary
//         const cloudinaryResponses = await Promise.all(predictions.map(async (prediction) => {
//             const resultBuffer = Buffer.from(prediction.result, 'base64');
//             const cloudinaryResponse = await cloudinaryUpload(resultBuffer);
//             return {
//                 filename: prediction.filename,
//                 prediction: prediction.prediction,
//                 cloudinary: cloudinaryResponse
//             };
//         }));

//         // Send the final response to the client
//         res.status(201).json(cloudinaryResponses);

//     } catch (error) {
//         // Log the error details for debugging
//         console.error('Error during file upload and processing:', error);
//         res.status(500).send('Error: ' + error.message);
//     }
// };















/** 
@desc Get all MRISCAN
@route /api/MRISCAN
@method GET
@access Public

*/

module.exports.getAllMRI = asyncHandler(async (req, res) => {
    const SCAN_PER_PAGE = 3;
    const { pageNumber } = req.query;
    let scans;
    if (pageNumber) {

        scans = await MRIScan.find().sort().skip((pageNumber - 1) * SCAN_PER_PAGE).limit(SCAN_PER_PAGE)
            .populate("Patient", ["_id", "FristName", "LastName"]);
    }
    else {
        scans = await MRIScan.find().sort({ createdAt: -1 })
            .populate("Patient", ["_id", "FristName", "LastName"]);
    }

    res.status(200).json(scans);
});



/** 
@desc Get MRIScan  by id
@route /api/MRIScan/:id
@method GET

@access Public

*/

/** 
@desc add new MriSCAN
@route /api/MRI
@method post
@access private(only log in user)
*/


const createNewMRI = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No image uploaded');
        }

        const formData = new FormData();

        // Convert the Buffer to a Blob
        const blob = Buffer.from(req.file.buffer);

        // Append the Blob to FormData
        formData.append('image', blob, { filename: 'image.nii' });

        // Make a POST request with Axios to Flask API for prediction
        const flaskResponse = await axios.post('http://localhost:5000/predict', formData, {
            headers: {
                ...formData.getHeaders() // Include the necessary headers for FormData
            }
        });

        const prediction = flaskResponse.data;

        // Compress the image (resize if necessary)
        // Example: Resize image to 50x50 pixels
        const compressedImage = await sharp(req.file.buffer).resize(50, 50).toBuffer();

        // Upload the compressed image to Cloudinary
        const cloudinaryResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(compressedImage, { resource_type: 'image' }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });

        // Save the scan details in the database
        const scan = await MRIScan.create({
            user: req.user.id,
            Patient: req.body.Patient,
            ScanDetails: req.body.ScanDetails,
            Prediction: prediction,
            Image: {
                url: cloudinaryResponse.secure_url,
                publicId: cloudinaryResponse.public_id,
            }
        });

        // Send response to the client
        res.status(201).json(scan);
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
};



// Endpoint to handle file upload and prediction
// const createNewMRI = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).send('No image uploaded');
//         }
//         const formData = new FormData();

//         // Convert the Buffer to a Blob
//         const blob = new Blob([req.file.buffer], { type: 'application/octet-stream' });

//         // Append the Blob to FormData
//         formData.append('image', blob, 'image.nii');

//         // Make a POST request with Axios
//         axios.post('http://localhost:5000/predict', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         })

//         // Send the image to the Flask API for prediction
//         // const formData = new FormData();
//         // formData.append('image', req.file.buffer, { filename: 'image.nii' });

//         // const flaskResponse = await axios.post('http://localhost:5000/predict', formData, {
//         //     headers: {
//         //         'Content-Type': 'multipart/form-data'
//         //     }
//         // });

//         const prediction = flaskResponse.data;

//         // Compress the image (resize if necessary)
//         // Example: Resize image to 50x50 pixels
//         const compressedImage = await sharp(req.file.buffer).resize(50, 50).toBuffer();

//         // Upload the compressed image to Cloudinary
//         const cloudinaryResponse = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
//             if (error) {
//                 throw error;
//             }
//             return result;
//         }).end(compressedImage);

//         // Save the scan details in the database
//         const scan = await MRIScan.create({
//             user: req.user.id,
//             Patient: req.body.Patient,
//             ScanDetails: req.body.ScanDetails,
//             Prediction: prediction,
//             Image: {
//                 url: cloudinaryResponse.secure_url,
//                 publicId: cloudinaryResponse.public_id,
//             }
//         });

//         // Send response to the client
//         res.status(201).json(scan);
//     } catch (error) {
//         res.status(500).send('Error: ' + error.message);
//     }
// };

// Export the controller and multer middleware







// module.exports.createNewMRI = asyncHandler(async (req, res) => {
//     //1.validation for image 
//     if (!req.file) {
//         return res.status(400).send('No image  uploaded');
//     }
//     //2.validation for data 
//     const { error } = validateCreateMRIScan(req.body);
//     if (error) {
//         res.status(400).send(error.details[0].message);
//     }
//     //3.upload photo
//     const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
//     const result = await cloudinaryUploadImage(imagePath);

//     //4.create new MRISCAN
//     const scan = await MRIScan.create(
//         {
//             user: req.user.id,
//             Patient: req.body.Patient,
//             ScanDetalies: req.body.ScanDetalies,
//             Image: {
//                 url: result.secure_url,
//                 publicId: result.public_id,
//             }

//         })
//     //5.send response to the client 
//     res.status(201).json(scan);
//     //6. remove image from the server
//     fs.unlinkSync(imagePath);


// }
// );
/** 
@desc update all MRISCAN
@route /api/MRISCAN/:id
@method put
@access private only user 
*/
module.exports.updateMRI = asyncHandler(async (req, res) => {
    //1.validation update
    const { error } = validateUpdateMRIScan(req.body);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    //2.get  MRI by id from database
    const scan = await MRIScan.findById(req.params.id);
    if (!scan) {
        return res.status(404).json({ message: 'MRI not found' });
    }
    if (req.user.id !== scan.user.toString()) {
        return res.status(403).json({ message: 'access denied' });
    }

    const updateMRI = await MRIScan.findByIdAndUpdate(req.params.id,
        {
            $set: {
                ScanDetalies: req.body.ScanDetalies,
            }
        }, { new: true }).populate('Patient');

    res.status(200).json(updateMRI);
}
);
/** 
@desc update mri image 
@route /api/MRISCAN/upload-image/:/id
@method put
@access private
*/
module.exports.updateMRIImage = asyncHandler(async (req, res) => {
    //1.validation update

    if (!req.file) {
        return res.status(400).json({ message: "no image provided" });
    }
    //2.get  MRI by id from database
    const scan = await MRIScan.findById(req.params.id);
    if (!scan) {
        return res.status(404).json({ message: 'MRI not found' });
    }
    if (req.user.id !== scan.user.toString()) {
        return res.status(403).json({ message: 'access denied' });
    }

    //4.delete old mri image
    await cloudinaryRemoveImage(scan.Image.publicId);
    //upload new image

    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
    //update image in Db
    const updateMRI = await MRIScan.findByIdAndUpdate(req.params.id,
        {
            $set: {
                Image: {
                    url: result.secure_url,
                    publicId: result.public_id,

                }
            }
        }, { new: true }).populate('Patient');
    res.status(200).json(updateMRI);
    //remov efrom server
    fs.unlinkSync(imagePath);

}
);
/** 
@desc delete all mri
@route /api/mris/:id
@method delete
@access privat e only user 
*/
module.exports.deleteMRI = asyncHandler(async (req, res) => {

    const mriscan = await MRIScan.findById(req.params.id);

    if (!mriscan) {

        res.status(404).json({ message: 'The MRISCAN with the given ID was not found.' })
    }
    if (req.user.id === mriscan.user.toString()) {
        await MRIScan.findByIdAndDelete(req.params.id);
        await cloudinaryRemoveImage(mriscan.Image.publicId);
        res.status(200).json({
            message: 'is delete',
            mriscanId: mriscan._id
        });
    }
    else {
        res.status(403).json({ message: "access denied " })
    }

}
);

module.exports.deleteMRIs = asyncHandler(async (req, res) => {
    const { ids } = req.body; // Assuming the IDs are provided in the "ids" property of the request body
    console.log(ids)
    try {
        // Iterate over the provided IDs and delete the corresponding documents
        for (const id of ids) {
            const mriscan = await MRIScan.findById(id);
            if (!mriscan) {
                return res.status(404).json({ message: `MRISCAN with ID ${id} not found.` });
            }
            if (req.user.id === mriscan.user.toString()) {
                await MRIScan.findByIdAndDelete(id);
                // Also delete associated images if needed
                await cloudinaryRemoveImage(mriscan.Image.publicId);
                console.log("deleting")
            } else {
                return res.status(403).json({ message: "Access denied." });
            }
        }

        res.status(200).json({ message: "MRIs deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});

