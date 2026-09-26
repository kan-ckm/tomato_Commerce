import { createBrowserRouter } from "react-router-dom";
import App from '../App'
import Home from '../pages/Home'
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import SignUp from "../pages/SignUp";
import GridMotion from "../pages/GridMotion";

import CategoryProduct from "../pages/CategoryProduct";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import AccountPageUser from "../pages/accountUser/AccountPageUser";
import ProfileTab from "../pages/accountUser/ProfileTab"

import Success from "../pages/success";
import Cancel from "../pages/Cancel";
import OrderPage from "../pages/accountUser/OrderPage";
import OrderDetailPage from "../pages/accountUser/orderDetails";
import ResetPassword from "../pages/accountUser/ResetPassword"




const router = createBrowserRouter([
    { 
        path:"/",
        element: <App/>,
        children : [
            {
                 path: "",
                 element: <Home/>
            },
            {
                path:"login",
                element:<Login/>
            },
       
            {
                path:"forgot-password",
                element:<ForgotPassword/>

            },
       
            {
                path:"sign-up",
                element:<SignUp/>
            },
            {   path: "Baner-cart",
                element : <GridMotion/>

            },
            {
                path:"product-category/:categoryName",
                element:<CategoryProduct/>
            },
            {
                path:"product/:id",
                element:<ProductDetails/>
            },
            {
                path:"success",
                element:<Success/>
            },
            {
                path:"cancel",
                element:<Cancel/>
            },
         
            {
                path:'order-detail/:id',
                element:<OrderDetailPage/>
            },
            {
                path:'cart',
                element:<Cart/>
            },
            {
                path:"account",
                element:<AccountPageUser/>,
                children:[
                    {
                        path:"profileUser",
                        element:<ProfileTab/>
                    
                    },
                    {
                        path:'ResetPassword',
                        element:<ResetPassword/>
                    },
                    {
                        path:"order",
                        element:<OrderPage/>
                    }
                    
                ]
            },
    
            
      
   
       
            
            
        ]
    }

]) 
export default router;