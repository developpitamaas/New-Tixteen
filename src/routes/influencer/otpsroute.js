const express = require("express");
const Auth = express.Router();
const Data = require("../../controllers/influencer/auth");

// send otp
Auth.route("/send-otp").post(Data.SendOTP);
// verify otp
Auth.route("/verify-otp").post(Data.OTPVerified);

module.exports = Auth;


