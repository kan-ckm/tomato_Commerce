




const backendDomain = "http://localhost:8080";  

const SummaryApi = {
  signUp: {
    url: `${backendDomain}/api/signup`,
    method: "post"
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "post"
  },
  Current_user: {
    url: `${backendDomain}/api/admin-detailes`,
    method: "get"
  },

  userLog_out: {
    url:`${backendDomain}/api/userLogout`,
    method : "get"
  },

   userForgotPassword: {
   url:`${backendDomain}/api/forgot-password`,
   method :"post"

  },
   userResetPassword: {
   url:`${backendDomain}/api/reset-password`,
   method :"post"

  },
   checkCode:{
    url:`${backendDomain}/api/verifyResetCode`,
    method:"post"

  },
  allUsers:{
     url:`${backendDomain}/api/all-user`,
     method:"get"

  },
   updateUser: {
    url:`${backendDomain}/api/update-user`,
    method:"post"
  },
  deleteUser:{
    url:`${backendDomain}/api/users`,
    method:"delete"
  },
  uploadProduct:{
    url:`${backendDomain}/api/upload-product`,
    method:"post"
  },
  allProduct:{
    url: `${backendDomain}/api/get-product`,
    method:"get"
  },
  
   updateProduct:{
      url: `${backendDomain}/api/update-product`,
      method:"post"


  },
    categoryProduct:{
      url: `${backendDomain}/api/get-categoryProduct`,
      method:"get"


    },
    categoryWiseProduct:{
      url: `${backendDomain}/api/category-product`,
      method:"post"

    },
    productDetails:{
      url: `${backendDomain}/api/product-details/:id`,
      method:"post"
    },
    productDelete:{
      url: `${backendDomain}/api/product-delete/:id`,
      method:"delete"

    },
   
    reviewProduct: {
      url: `${backendDomain}/api/review/:id`,
      method: "post"
    },
    addToCartProduct:{
      url: `${backendDomain}/api/addtocart`,
      method: "post"
    },
    addToCartProductCount:{
      url: `${backendDomain}/api/countAddToCartProduct`,
      method: "get"
    },
    addToCartProductView:{
      url: `${backendDomain}/api/view-cart-product`,
      method: "get" 

    },
    updateCartProduct:{
      url: `${backendDomain}/api/update-cart-product`,
      method: "post"
    },
    deleteCartProduct:{
      url: `${backendDomain}/api/delete-cart-product`,
      method: "delete"
    },
    searchProduct: {
      url: `${backendDomain}/api/products/search`,
      method: "get"
    },
    updateProfileUser: {
      url: `${backendDomain}/api/update-profile`,
      method: "put"
    },

  
  
};

export default SummaryApi;
