const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }); // files will be temporarily saved to 'uploads/' directory

// Enable CORS for all routes
app.use(cors());

// Serve packages statically from the 'public/packages' directory
app.use('/packages', express.static('public/packages'));

// POST endpoint for uploading packages
app.post('/packages', upload.single('package'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Move file to permanent location
    const targetPath = path.join(__dirname, 'public/packages', req.file.originalname);
    
    // Rename the file to its original name
    fs.rename(req.file.path, targetPath, (err) => {
        if (err) {
            return res.status(500).send('Error saving file.');
        }
        res.status(201).send(`Package uploaded successfully: ${req.file.originalname}`);
    });
});

// GET endpoint to download a package by name
app.get('/packages/:name', (req, res) => {
    const packageName = req.params.name;
    const filePath = path.join(__dirname, 'public/packages', packageName);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('Package not found.');
        }
        res.sendFile(filePath);
    });
});

// Set port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
