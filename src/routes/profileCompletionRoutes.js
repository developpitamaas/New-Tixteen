const express = require('express');
const router = express.Router();
const { completeProfile } = require('../controllers/profileCompletionController');

// Define route for profile completion
router.post('/complete-profile', completeProfile);

module.exports = router;
