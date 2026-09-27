const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'ddjvcv8gf';
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'Kan_product';
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Configure Cloudinary SDK if API credentials are present
if (API_KEY && API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

/**
 * Upload a single buffer to Cloudinary
 * @param {Buffer} buffer - File buffer from multer memoryStorage
 * @param {string} originalname - Original file name
 * @param {string} folder - Target Cloudinary folder
 * @returns {Promise<string>} - Cloudinary secure HTTPS URL
 */
async function uploadToCloudinary(buffer, originalname = 'upload.png', folder = 'Kanproduct') {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('A valid file buffer is required for upload');
  }

  // Path 1: If API key & secret exist, use official Cloudinary SDK upload_stream
  if (API_KEY && API_SECRET) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(new Error(`Cloudinary SDK error: ${error.message}`));
          resolve(result.secure_url || result.url);
        }
      );
      uploadStream.end(buffer);
    });
  }

  // Path 2: Unsigned preset direct upload (preset: Kan_product, cloud: ddjvcv8gf)
  const blob = new Blob([buffer]);
  const formData = new FormData();
  formData.append('file', blob, originalname);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) {
    formData.append('folder', folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok || data.error) {
    const errorMsg = data.error?.message || `HTTP ${response.status} ${response.statusText}`;
    throw new Error(`Cloudinary upload failed: ${errorMsg}`);
  }

  return data.secure_url || data.url;
}

/**
 * Upload multiple file buffers in parallel
 * @param {Array<{buffer: Buffer, originalname: string}>} files
 * @param {string} folder
 * @returns {Promise<string[]>}
 */
async function uploadMultipleToCloudinary(files, folder = 'Kanproduct') {
  if (!files || files.length === 0) return [];
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, file.originalname, folder)
  );
  return Promise.all(uploadPromises);
}

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  cloudinary,
};
