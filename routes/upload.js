// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { compressAndUploadToCloudinary, sendFilesToFlaskAPI, uploadResultToCloudinary } = require("../utils/cloudinary");
const { upload } = require("../middlewares/upload_nii");

//console.log('Upload Middleware:', upload); // Log to verify the import

router.post("/", upload.array('file'), async (req, res) => {
    console.log('Request Body:', req.body); // Check the request body
    console.log('Uploaded Files:', req.files); // Check the uploaded files

    const { files } = req;
    if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded.' });
    }

    // Array to store the URLs of the uploaded files
    let fileUrls = [];

    try {
        // Assuming you're handling multiple files and uploading each of them
        for (const file of files) {
            const uploadedFile = await compressAndUploadToCloudinary(file.buffer);
            fileUrls.push({ public_id: uploadedFile.public_id, secure_url: uploadedFile.secure_url })
        }
        sendFilesToFlaskAPI(fileUrls)
            .then((data) => res.json({ file_urls: fileUrls, results: data }))
            .catch((err) => reject(err));



    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
});




module.exports = router;
