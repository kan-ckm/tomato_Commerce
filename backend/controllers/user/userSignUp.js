
const userModel = require("../../models/userModel");
const bcrypt = require('bcrypt');
async function userSignUpController(req, res) {
    try {
       
        const { name, password, email, confirmPassword } = req.body;

      
        const user = await userModel.findOne({ email });

   
        
        
        
        
        
        if (!email) {
            throw new Error('Please enter email');
        }
        
        
        if (!password) {
            throw new Error('Please enter password');
        }
        const passwordStrengthPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
        
        if (!passwordStrengthPattern.test(password)) {
            throw new Error('New password must be at least 8 characters long and contain both letters and numbers.')
        }
        
        if (user) {
            throw new Error('This email is already registered! Please use another email.');
        }
        if (!name) {
            throw new Error('Please enter name');
        }
            if (password !== confirmPassword) {
               throw new Error("Passwords do not match");
            }

      
        const salt = bcrypt.genSaltSync(10);

        
        const hashPassword = await bcrypt.hashSync(password, salt);

    
        if (!hashPassword) {
            throw new Error("Có lỗi xảy ra khi mã hóa mật khẩu");
        }

        const payload = {
            ...req.body,   
            role: "GENERAL",  
            password: hashPassword  
        };

        const userData = userModel(payload);
        const saveUser = await userData.save();

        res.status(201).json({
            data: saveUser,
            success: true,
            error: false,
            message: "Create success !!"
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = userSignUpController;
