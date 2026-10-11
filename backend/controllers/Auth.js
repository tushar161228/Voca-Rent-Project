const AuthController = require('../core/AuthController');
const config = require('../config');
const User = require('../models/User');

const Auth = new AuthController(User, {
    jwtSecret: config.jwtSecret,
    jwtExpiresIn: config.jwtExpiresIn,
    loginType: 'password',         // 'password' or 'otp'
    otpField: 'mobile',            // 'mobile' or 'email'
    otpLimit: 5,                   // OTP attempts allowed per minute
    otpExpiry: 10 * 60 * 1000, 
    
     updateUser: {
        pre: async (userId, updates, req, res) => {
            const restrictedFields = ['otp', 'isBlocked', 'isVerified', 'role', 'subscription', 'email', 'mobile'];
            
            // Check if any restricted field exists in the updates object
            const hasRestrictedField = restrictedFields.some(field => field in updates);

            if (hasRestrictedField) {
                return res.status(400).json({ 
                    message: "These fields you can not update" 
                });
            }
        },
    }
});



module.exports = Auth;