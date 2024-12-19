// otpModel.js

const mongoose = require('mongoose');

// Define OTP schema
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600 // OTP documents expire after 10 minutes (adjust as needed)
  }
});

// Create OTP model
const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
