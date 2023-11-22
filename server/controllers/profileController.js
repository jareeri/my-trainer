// profileController.js

const admin = require('firebase-admin');

const storage = admin.storage();
const bucket = storage.bucket();

const uploadProfileImage = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ error: 'No profile image uploaded.' });
    }

    const userId = req.user.id; // Assuming you have a user ID available in the request

    const destination = `profile-images/${userId}-${file.originalname}`;
    const fileUpload = bucket.file(destination);

    try {
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
        });

        // Update user profile image URL in the database (replace this with your database logic)
        // Example: await User.update({ profileImageUrl: `firebase-storage-url/${destination}` }, { where: { id: userId } });

        return res.status(200).json({ message: 'Profile image uploaded successfully.' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to upload profile image.' });
    }
};

module.exports = { uploadProfileImage };
