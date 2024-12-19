const express = require('express');
const router = express.Router();
const otpVerificationController = require('../controllers/otpVerificationController.js');

router.post('/verify-otp', otpVerificationController.verifyOTP);
module.exports = router;
