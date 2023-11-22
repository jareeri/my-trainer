// multerMiddleware.js

const multer = require("multer");
const admin = require("firebase-admin");

// Firebase configuration setup
const serviceAccount = require("path/to/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-firebase-storage-bucket-url",
});

const storage = admin.storage();
const bucket = storage.bucket();

// Multer setup for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

const uploadImageToFirebase = (req, res, next) => {
  // The 'image' key should match the field name in your form
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "Failed to upload file." });
    }
    next();
  });
};

module.exports = { uploadImageToFirebase };

const uploadProfileImageToFirebase = (req, res, next) => {
    // The 'profileImage' key should match the field name in your form
    upload.single('profileImage')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: 'Failed to upload profile image.' });
        }
        next();
    });
};

module.exports = { uploadProfileImageToFirebase };