const express = require('express');
const loginController = require('../controllers/loginController.js');

const router = express.Router();

// Define the login route
router.post('/login', loginController.LoginUser);

module.exports = router;
