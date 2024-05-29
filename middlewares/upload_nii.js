
// upload_nii.js
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

console.log('Multer Instance:', upload); // Log the multer instance

module.exports = {upload};
