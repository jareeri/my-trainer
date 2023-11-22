// imageController.js

const admin = require('firebase-admin');

const storage = admin.storage();
const bucket = storage.bucket();

const uploadImage = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const destination = `images/${file.originalname}`;
    const fileUpload = bucket.file(destination);

    try {
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        return res.status(200).json({ message: 'File uploaded successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to upload file.' });
    }
};

module.exports = { uploadImage };

const getImage = (req, res) => {
    const fileName = req.params.fileName;

    const file = bucket.file(`images/${fileName}`);

    const readStream = file.createReadStream();

    readStream.on('error', (err) => {
        return res.status(404).json({ error: 'Image not found.' });
    });

    readStream.pipe(res);
};

module.exports = { getImage };