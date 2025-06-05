const multer = require('multer');
const {cloudinary} = require('../config/CloudinaryConfig')
const {CloudinaryStorage} = require('multer-storage-cloudinary')

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      console.log('now in multer storage');
        return {
            folder: 'uploads', // The name of the folder in Cloudinary
            allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
            public_id: file.fieldname + '-' + Date.now(), // Unique public ID for the uploaded file
        };
    },
})

const upload = multer({ storage: storage });

module.exports = upload;