const express = require('express');
const router = express.Router();

const userSignUpController = require('../controllers/user/userSignUp')
const userSignInController = require('../controllers/user/userSignIn');
const userDetailesController = require('../controllers/user/userDetailes')
const authToken = require('../middleware/authToken');

const allUsersController = require('../controllers/adminpanal/AllUsers.js');
const updateUserController = require('../controllers/adminpanal/UpdateUser.js');
const uploadProductController = require('../controllers/adminpanal/uploadProduct.js');
const uploadImageController = require('../controllers/adminpanal/uploadImage.js');
const getProductController = require('../controllers/adminpanal/getProduct');
const updateProductController = require('../controllers/adminpanal/updateProduct.js');
const getCategoryProduct = require('../controllers/product/getCategoryProudctOne');
const getCategoryWiseProduct = require('../controllers/product/getCategoryWiseProudct');
const getProductDetails = require('../controllers/product/getProductDetails');
const deleteProductController = require('../controllers/adminpanal/deleteProduct');
const Review = require('../models/reviewModel');
const reviewController = require('../controllers/product/review');
const getProductReviewsController = require('../controllers/product/getProductReview');
const addToCartController = require('../controllers/user/addToCartController');
const countAddToCartProduct = require('../controllers/user/countAddToCartProduct');
const addToCartViewProduct = require('../controllers/user/addToCartViewProduct');
const updateAddToCartProduct = require('../controllers/user/updateAddToCartProduct');
const deleteAddToCartProduct = require('../controllers/user/deleteAddToCartProduct');
const searchProduct = require('../controllers/product/sreachProduct');
const { deleteUser } = require('../controllers/adminpanal/DeleteUser.js');
const { forgotPassword } = require('../controllers/user/forgotPassword');
const { resetPassword } = require('../controllers/user/resetPassword');
const { verifyResetCode } = require('../controllers/user/userVerifyCode');
const getProductId = require('../controllers/product/getProductId');


const adminGetProductById = require('../controllers/adminpanal/adminGetProductById.js');
const { getProductDetailsId } = require('../controllers/adminpanal/getProductDetailsId.js');
const adminAuth = require('../middleware/adminAuth.js');
const  {getNewUsersToday, getActiveUsers, getChurnRate, getNewUsersInMonth}  = require('../controllers/adminpanal/newUserToDay.js');
const getAdminDetailsController = require('../controllers/adminpanal/getAdminDetails.js');
const { userLogout, adminLogout } = require('../controllers/user/userLogout.js');
const { getUserGrowth, getUserActivityHeatmap, getReviewSummary, getSalesTrend, getTotalSalesThisMonth, getSalesOverview, getCategoryDistribution } = require('../controllers/adminpanal/getUserChartData.js');
const getFilteredProducts = require('../controllers/product/filterProduct');
const { paymentController } = require('../controllers/order/paymentController.js');
const { webhooks } = require('../controllers/order/webhook.js');
const { orderController } = require('../controllers/order/orderController.js');
const { updateAdminProfile } = require('../controllers/adminpanal/upadateProfileAdmin.js');
const { updateUserProfile, resetPasswordProfile } = require('../controllers/user/updateUserProfile.js');
const upload = require('../middleware/upload.js');
const { getAllOrders } = require('../controllers/adminpanal/Order/getOrder.js');
const { deleteOrder } = require('../controllers/adminpanal/Order/deleteOrder.js');
const { getOrdersChart } = require('../controllers/adminpanal/Order/dailyOrdersChartController.js');




router.post("/signup", userSignUpController);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/update-profile", authToken,updateUserProfile);
router.post("/userLogout",userLogout)
router.put("/update-password-user", authToken, resetPasswordProfile);
router.post("/signin",userSignInController);
router.get("/userdetailes",authToken,userDetailesController)

router.get("/all-user",adminAuth,allUsersController)
router.put("/update-user",adminAuth,updateUserController)
router.delete('/users/:id', adminAuth, deleteUser);
router.get("/get-product/:id",adminAuth, getProductId);
router.get("/admin/product-details/:id", adminGetProductById);
router.post('/update-product',adminAuth, updateProductController);
router.get('/product-details/:id', getProductDetailsId);
router.get('/users-today',adminAuth,getNewUsersToday)
router.get("/active-users",adminAuth, getActiveUsers);
router.get("/admin-detailes", adminAuth, getAdminDetailsController);
router.get("/user-churnrate",adminAuth,getChurnRate)
router.get("/get-user-growth",adminAuth,getUserGrowth)
router.get('/get-user-activity-heatmap',adminAuth,getUserActivityHeatmap)
router.get('/get-review-summary',adminAuth,getReviewSummary)
router.get('/get-sales-trend',adminAuth,getSalesTrend)
router.post("/admin-logout",adminLogout)
router.get('/get-user-month',adminAuth,getNewUsersInMonth)
router.get('/get-total-sales-this-month',adminAuth,getTotalSalesThisMonth)
router.get('/get-sales-overview',adminAuth,getSalesOverview)
router.get("/get-product",adminAuth,getProductController)
router.get("/get-category-distribution",adminAuth,getCategoryDistribution)
router.put("/update-prodfile-admin",adminAuth,updateAdminProfile)
router.delete("/product-delete/:id",deleteProductController)
router.post("/upload-product", adminAuth, upload.array("images", 10), uploadProductController);
router.post("/upload-image", adminAuth, upload.single("image"), uploadImageController);

router.get('/get-orders',adminAuth, getAllOrders);
router.get('/get-order-daily',adminAuth, getOrdersChart);
router.delete('/delete-order/:id',adminAuth, deleteOrder);

router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.get("/product-details/:id",getProductDetails)

router.post("/review/", authToken,reviewController );
router.get("/review/:id", getProductReviewsController)
router.get("/products/search",searchProduct)
router.get('/filter-product', getFilteredProducts);

router.post("/addtocart", authToken, addToCartController);
router.get("/countAddToCartProduct", authToken, countAddToCartProduct)
router.get("/view-cart-product",authToken, addToCartViewProduct)
router.post("/update-cart-product", authToken, updateAddToCartProduct)
router.delete("/delete-cart-product", authToken, deleteAddToCartProduct)

router.post('/checkout',authToken,paymentController)
router.get("/oder-list",authToken,orderController)



module.exports = router;
 