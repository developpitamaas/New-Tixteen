const express = require('express');
const signupController = require('../controllers/signupController.js');

const router = express.Router();

// Define the signup route
router.post('/signup', signupController.signupUser);

module.exports = router; 
