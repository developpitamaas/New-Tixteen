const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Destination folder for storing intro videos
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${fileExtension}`); // Unique filename for uploaded video
  }
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Function to handle intro video upload
const uploadIntroVideo = (req, res) => {
  // Upload intro video using Multer
  upload.single('intro_video')(req, res, (err) => {
    if (err) {
      console.error('Error uploading intro video:', err);
      return res.status(500).json({ success: false, message: 'Failed to upload intro video' });
    }
    // Return the path or URL of the uploaded video
    res.status(200).json({ success: true, message: 'Intro video uploaded successfully', videoUrl: req.file.path });
  });
};

module.exports = uploadIntroVideo;
