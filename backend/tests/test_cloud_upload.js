const assert = require('assert');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { uploadToCloudinary, uploadMultipleToCloudinary } = require('../helpers/uploadCloudinary');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');

// 1x1 transparent PNG buffer
const samplePngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

async function runTests() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ LUỒNG MEDIA CLOUD UPLOAD (CLOUDINARY)');
  console.log('====================================================\n');

  // Connect MongoDB
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Kan-ban-hang';
  await mongoose.connect(mongoUri);
  console.log('✓ Kết nối MongoDB thành công.');

  // Test 1: Upload single buffer to Cloudinary
  console.log('\n--- Test 1: uploadToCloudinary (Single Buffer Memory Stream) ---');
  const singleUrl = await uploadToCloudinary(samplePngBuffer, 'test_single.png', 'Kanproduct');
  console.log('   URL nhận được:', singleUrl);
  assert(singleUrl.startsWith('https://res.cloudinary.com/'), 'URL phải là Cloudinary HTTPS');
  assert(singleUrl.includes('Kanproduct'), 'URL phải nằm trong folder Kanproduct');
  console.log('✅ Test 1 PASS: Upload đơn lẻ thành công lên Cloudinary.');

  // Test 2: Upload multiple buffers in parallel
  console.log('\n--- Test 2: uploadMultipleToCloudinary (Parallel Batch Upload) ---');
  const files = [
    { buffer: samplePngBuffer, originalname: 'batch_1.png' },
    { buffer: samplePngBuffer, originalname: 'batch_2.png' },
  ];
  const urls = await uploadMultipleToCloudinary(files, 'Kanproduct');
  console.log('   Số URLs nhận được:', urls.length);
  urls.forEach((u, i) => console.log(`   [${i + 1}] ${u}`));
  assert.strictEqual(urls.length, 2, 'Phải trả về đúng 2 URLs');
  urls.forEach((u) => assert(u.startsWith('https://res.cloudinary.com/')));
  console.log('✅ Test 2 PASS: Upload song song nhiều ảnh thành công lên Cloudinary.');

  // Test 3: Test uploadProductController integration
  console.log('\n--- Test 3: uploadProductController với productModel trong MongoDB ---');
  // Find or create admin user for permission check
  let adminUser = await userModel.findOne({ role: 'ADMIN' });
  if (!adminUser) {
    adminUser = await userModel.findOne();
  }
  assert(adminUser, 'Cần ít nhất một user trong database');

  const uploadProductController = require('../controllers/adminpanal/uploadProduct');

  const req = {
    userId: adminUser._id.toString(),
    files: [
      { buffer: samplePngBuffer, originalname: 'prod_cloud_1.png' },
      { buffer: samplePngBuffer, originalname: 'prod_cloud_2.png' },
    ],
    body: {
      productName: 'Cloud Upload Test Product ' + Date.now(),
      brandName: 'CloudBrand',
      category: 'watches',
      price: 100000,
      sellingPrice: 80000,
      description: 'Test product for verifying Cloudinary media storage',
      countInStock: 50,
    },
  };

  let responseData = null;
  let responseStatus = 200;
  const res = {
    status: (code) => {
      responseStatus = code;
      return res;
    },
    json: (payload) => {
      responseData = payload;
      return res;
    },
  };

  await uploadProductController(req, res);

  assert.strictEqual(responseStatus, 200, 'Status phải là 200');
  assert.strictEqual(responseData.success, true, 'success phải là true');
  assert(responseData.data, 'Phải có dữ liệu sản phẩm đã lưu');
  assert.strictEqual(responseData.data.productImage.length, 2, 'Sản phẩm phải có 2 ảnh');
  responseData.data.productImage.forEach((img) => {
    assert(img.startsWith('https://res.cloudinary.com/'), 'Ảnh phải được lưu link Cloudinary');
  });
  console.log('   Tên sản phẩm vừa tạo:', responseData.data.productName);
  console.log('   Ảnh sản phẩm 1:', responseData.data.productImage[0]);
  console.log('   Ảnh sản phẩm 2:', responseData.data.productImage[1]);

  // Verify in MongoDB directly
  const savedInDb = await productModel.findById(responseData.data._id);
  assert(savedInDb, 'Sản phẩm phải tồn tại trong MongoDB');
  assert.strictEqual(savedInDb.productImage.length, 2);
  assert(savedInDb.productImage[0].startsWith('https://res.cloudinary.com/'));
  console.log('✅ Test 3 PASS: Sản phẩm mới tạo lưu link Cloudinary trực tiếp vào MongoDB.');

  // Clean up test product
  await productModel.findByIdAndDelete(responseData.data._id);
  console.log('   (Đã dọn dẹp sản phẩm test trong MongoDB)');

  // Test 4: uploadImageController integration
  console.log('\n--- Test 4: uploadImageController (/api/upload-image) ---');
  const uploadImageController = require('../controllers/adminpanal/uploadImage');
  const reqImg = {
    file: {
      buffer: samplePngBuffer,
      originalname: 'single_test_image.png',
    },
  };
  let imgResponseData = null;
  const resImg = {
    status: (code) => resImg,
    json: (payload) => {
      imgResponseData = payload;
      return resImg;
    },
  };

  await uploadImageController(reqImg, resImg);
  assert.strictEqual(imgResponseData.success, true, 'uploadImage phải trả về success: true');
  assert(imgResponseData.url.startsWith('https://res.cloudinary.com/'), 'URL phải là Cloudinary');
  console.log('   URL uploadImage trả về:', imgResponseData.url);
  console.log('✅ Test 4 PASS: Controller uploadImage trả về URL Cloudinary thành công.');

  await mongoose.disconnect();
  console.log('\n====================================================');
  console.log('🎉 TOÀN BỘ 4/4 BÀI TEST CLOUD UPLOAD ĐÃ PASS 100%!');
  console.log('====================================================');
}

runTests().catch((err) => {
  console.error('\n❌ TEST THẤT BẠI:', err);
  process.exit(1);
});
