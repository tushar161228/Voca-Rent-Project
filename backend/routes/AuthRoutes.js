const express = require('express');
const router = express.Router();
const auth = require('../controllers/Auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/verify-otp', auth.verifyOtp);
router.post('/send-otp', auth.sendOtp);

// forgot password
router.post("/forgot-password", auth.forgotPassword);
router.post("/reset-password", auth.resetPassword);


router.put('/profile',auth.authenticateToken,auth.updateUser);
router.get('/profile',auth.authenticateToken,auth.getUser);


module.exports = router;
