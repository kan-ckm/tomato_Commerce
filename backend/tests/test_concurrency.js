const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/productModel');
const OrderModel = require('../models/orderProductModel');
const { processOrderCheckoutSession } = require('../controllers/order/webhook');

async function runAllTests() {
  console.log('=====================================================');
  console.log('BẮT ĐẦU TEST TOÀN DIỆN CONCURRENCY & RACE CONDITION');
  console.log('=====================================================\n');

  await connectDB();

  // ------------------------------------------------------------------
  // TEST 1: HAI NGƯỜI CÙNG TRANH MUA MÓN HÀNG CUỐI CÙNG (countInStock = 1)
  // ------------------------------------------------------------------
  console.log('--- TEST 1: HAI NGƯỜI CÙNG MUA MÓN HÀNG CUỐI CÙNG (countInStock = 1) ---');
  const product1 = await Product.create({
    productName: 'Điện thoại độc bản (Chỉ còn 1)',
    brandName: 'TestBrand',
    category: 'Phone',
    description: 'Chỉ còn đúng 1 sản phẩm trong kho',
    price: 10000000,
    sellingPrice: 9000000,
    countInStock: 1,
    sales: 0
  });

  const sessionA = {
    id: 'cs_test_A_' + Date.now(),
    payment_intent: 'pi_test_A_' + Date.now(),
    customer_details: { name: 'Khách A', email: 'khacha@gmail.com', phone: '0901111111' },
    amount_total: 9000000,
    metadata: { userId: 'user_A' }
  };
  const itemsA = [{ productId: product1._id, name: product1.productName, price: 9000000, quantity: 1 }];

  const sessionB = {
    id: 'cs_test_B_' + Date.now(),
    payment_intent: 'pi_test_B_' + Date.now(),
    customer_details: { name: 'Khách B', email: 'khachb@gmail.com', phone: '0902222222' },
    amount_total: 9000000,
    metadata: { userId: 'user_B' }
  };
  const itemsB = [{ productId: product1._id, name: product1.productName, price: 9000000, quantity: 1 }];

  // Chạy 2 webhook song song đồng thời
  const [resA, resB] = await Promise.all([
    processOrderCheckoutSession(sessionA, itemsA),
    processOrderCheckoutSession(sessionB, itemsB)
  ]);

  const p1After = await Product.findById(product1._id);

  console.log('Kết quả Khách A:', resA.success ? 'THÀNH CÔNG (Pending)' : 'THẤT BÀI / HOÀN TIỀN (Cancelled)');
  console.log('Kết quả Khách B:', resB.success ? 'THÀNH CÔNG (Pending)' : 'THẤT BÀI / HOÀN TIỀN (Cancelled)');
  console.log('Tồn kho còn lại:', p1After.countInStock);
  console.log('Lượng hàng đã bán (sales):', p1After.sales);

  const successCount = (resA.success ? 1 : 0) + (resB.success ? 1 : 0);
  const failedCount = (!resA.success ? 1 : 0) + (!resB.success ? 1 : 0);

  if (successCount === 1 && failedCount === 1 && p1After.countInStock === 0 && p1After.sales === 1) {
    console.log('=> TEST 1 ĐẠT: Chỉ đúng 1 người mua được, người còn lại tự động huỷ/hoàn tiền và không bị bán khống!\n');
  } else {
    throw new Error('TEST 1 THẤT BÀI: Xảy ra bán vượt tồn kho!');
  }

  // ------------------------------------------------------------------
  // TEST 2: IDEMPOTENCY (STRIPE GỬI WEBHOOK LẶP LẠI CHO CÙNG 1 GIAO DỊCH)
  // ------------------------------------------------------------------
  console.log('--- TEST 2: KIỂM TRA CHỐNG TRÙNG LẶP WEBHOOK (IDEMPOTENCY) ---');
  const duplicateRes = await processOrderCheckoutSession(sessionA, itemsA);
  const p1AfterDup = await Product.findById(product1._id);

  if (duplicateRes.alreadyProcessed === true && p1AfterDup.countInStock === 0 && p1AfterDup.sales === 1) {
    console.log('=> TEST 2 ĐẠT: Webhook gửi lại lần 2 không bị trừ kho lần nữa, không nhân đôi đơn hàng!\n');
  } else {
    throw new Error('TEST 2 THẤT BÀI: Idempotency không hoạt động!');
  }

  // ------------------------------------------------------------------
  // TEST 3: ĐƠN HÀNG NHIỀU MÓN VÀ ROLLBACK NẾU CÓ 1 MÓN BỊ HẾT HÀNG
  // ------------------------------------------------------------------
  console.log('--- TEST 3: ĐƠN HÀNG NHIỀU MÓN & TỰ ĐỘNG ROLLBACK KHI CÓ MÓN HẾT HÀNG ---');
  const productA = await Product.create({
    productName: 'Món A (Còn 5)',
    brandName: 'Test',
    category: 'Test',
    description: 'Có đủ hàng',
    price: 50000,
    sellingPrice: 40000,
    countInStock: 5,
    sales: 0
  });

  const productB = await Product.create({
    productName: 'Món B (Hết hàng - Còn 0)',
    brandName: 'Test',
    category: 'Test',
    description: 'Đã hết sạch',
    price: 100000,
    sellingPrice: 90000,
    countInStock: 0,
    sales: 0
  });

  const multiItemSession = {
    id: 'cs_multi_' + Date.now(),
    payment_intent: 'pi_multi_' + Date.now(),
    customer_details: { name: 'Khách C', email: 'khachc@gmail.com' },
    amount_total: 130000,
    metadata: { userId: 'user_C' }
  };
  const multiItems = [
    { productId: productA._id, name: productA.productName, price: 40000, quantity: 2 },
    { productId: productB._id, name: productB.productName, price: 90000, quantity: 1 }
  ];

  const multiRes = await processOrderCheckoutSession(multiItemSession, multiItems);
  const pAAfter = await Product.findById(productA._id);
  const pBAfter = await Product.findById(productB._id);

  console.log('Kết quả đơn hàng nhiều món:', multiRes.success ? 'THÀNH CÔNG' : 'HỦY DO HẾT MÓN B');
  console.log('Tồn kho Món A sau khi rollback:', pAAfter.countInStock, '(Ban đầu: 5)');
  console.log('Tồn kho Món B:', pBAfter.countInStock, '(Ban đầu: 0)');

  if (!multiRes.success && pAAfter.countInStock === 5 && pAAfter.sales === 0) {
    console.log('=> TEST 3 ĐẠT: Món A đã được rollback hoàn toàn về kho (vẫn là 5) khi Món B hết hàng!\n');
  } else {
    throw new Error('TEST 3 THẤT BÀI: Rollback không hoạt động chính xác!');
  }

  // ------------------------------------------------------------------
  // TEST 4: THÊM VÀO GIỎ HÀNG SẢN PHẨM HẾT HÀNG (countInStock = 0)
  // ------------------------------------------------------------------
  console.log('--- TEST 4: CHẶN THÊM VÀO GIỎ SẢN PHẨM HẾT HÀNG ---');
  const outOfStockProd = await Product.create({
    productName: 'Hàng Cháy Kho',
    brandName: 'Test',
    category: 'Test',
    description: '0 cái trong kho',
    price: 10000,
    sellingPrice: 8000,
    countInStock: 0,
    sales: 0
  });

  const addToCartController = require('../controllers/user/addToCartController');
  let mockResCart = {};
  await addToCartController(
    { body: { productId: outOfStockProd._id }, userId: new mongoose.Types.ObjectId() },
    {
      json: (data) => { mockResCart = data; return data; }
    }
  );

  console.log('Phản hồi khi thêm hàng hết kho:', mockResCart);
  if (mockResCart.error && mockResCart.message.includes('hết hàng')) {
    console.log('=> TEST 4 ĐẠT: Đã chặn thành công việc thêm sản phẩm hết hàng vào giỏ!\n');
  } else {
    throw new Error('TEST 4 THẤT BÀI: Vẫn cho phép thêm hàng hết kho vào giỏ!');
  }

  // ------------------------------------------------------------------
  // TEST 5: CHẶN CHECKOUT VỚI SỐ LƯỢNG VƯỢT TỒN KHO TẠI PAYMENT CONTROLLER
  // ------------------------------------------------------------------
  console.log('--- TEST 5: CHẶN TẠO PHIÊN THANH TOÁN KHI TỒN KHO KHÔNG ĐỦ ---');
  const lowStockProd = await Product.create({
    productName: 'Hàng Số Lượng Ít',
    brandName: 'Test',
    category: 'Test',
    description: 'Chỉ còn 2 cái',
    price: 10000,
    sellingPrice: 8000,
    countInStock: 2,
    sales: 0
  });

  const { paymentController } = require('../controllers/order/paymentController');
  let checkoutStatus = 200;
  let checkoutRes = {};
  const mockRes = {
    status: (code) => {
      checkoutStatus = code;
      return {
        json: (data) => { checkoutRes = data; return data; }
      };
    },
    json: (data) => { checkoutRes = data; return data; }
  };

  await paymentController(
    {
      body: {
        cartItems: [{ productId: lowStockProd, quantity: 5 }] // Muốn mua 5 trong khi kho chỉ có 2
      },
      userId: new mongoose.Types.ObjectId()
    },
    mockRes
  );

  console.log(`Mã HTTP: ${checkoutStatus} | Phản hồi:`, checkoutRes.message);
  if (checkoutStatus === 400 && checkoutRes.error && (checkoutRes.message.includes('trong kho') || checkoutRes.message.includes('không đủ'))) {
    console.log('=> TEST 5 ĐẠT: Đã chặn ngay ở cổng checkout nếu đặt vượt tồn kho!\n');
  } else {
    throw new Error('TEST 5 THẤT BÀI: Vẫn cho phép tạo checkout vượt tồn kho!');
  }

  // Dọn dẹp dữ liệu test
  await Product.deleteMany({ _id: { $in: [product1._id, productA._id, productB._id, outOfStockProd._id, lowStockProd._id] } });
  await OrderModel.deleteMany({ 'paymentDetails.paymentId': { $in: [sessionA.payment_intent, sessionB.payment_intent, multiItemSession.payment_intent] } });

  console.log('=====================================================');
  console.log('TẤT CẢ 5 BÀI TEST RACE CONDITION & INVENTORY ĐỀU PASS 100%!');
  console.log('=====================================================');
  process.exit(0);
}

runAllTests().catch(err => {
  console.error('LỖI KHI TEST:', err);
  process.exit(1);
});
