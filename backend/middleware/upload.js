const multer = require('multer');

// Use memoryStorage so file buffers are kept in RAM and streamed directly to Cloudinary
// without writing intermediate files to server disk.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per image
  },
  fileFilter,
});

module.exports = upload;
