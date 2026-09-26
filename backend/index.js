const express =require('express')
const cors =require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const path = require('path');

const router = require('./routers')
const bodyParser = require("body-parser");
const { webhooks } = require('./controllers/order/webhook');



const app = express()
app.post('/api/webhook', express.raw({ type: 'application/json' }), webhooks);
app.use(cors({
 origin : [process.env.FONTEND_URL,process.env.ADMIN_URL],
    credentials : true,


}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use(cookieParser())
app.use("/api",router)
const PORT = 8080||process.env.PORT
connectDB().then(() => {
    console.log("kết nối tới DB")
    app.listen(PORT, () => {
        console.log("Sever đang chạy");
    });
});


