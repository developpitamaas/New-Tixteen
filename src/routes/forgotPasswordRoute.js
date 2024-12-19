// routes/forgotPasswordRoute.js
const express = require('express');
const router = express.Router();
const { requestPasswordReset } = require('../controllers/resetPasswordController');

router.post('/forgot-password', requestPasswordReset);

module.exports = router;
