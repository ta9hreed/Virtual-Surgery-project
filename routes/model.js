const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('niiFile'), uploadFile);

module.exports = router;
