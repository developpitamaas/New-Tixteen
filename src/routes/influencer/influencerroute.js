const express = require("express");
const User = express.Router();
const Data = require("../../controllers/influencer/influencercontroller");
const auth = require("../../middleware/Auth");

// register  
User.route("/register-user").post(Data.RegisterUser)

// login
User.route("/login-user").post(Data.LoginUser)
  
// my profile
User.route("/my-profile").get(auth.IsAuthenticateInfulncer, Data.myProfile)

// update
User.route("/update-user/:id").put(auth.IsAuthenticateUser, Data.updateUser)

// delete user
User.route("/delete-user/:id").delete(auth.IsAuthenticateInfulncer, Data.deleteUser)

// get all users
User.route("/get-all-users").get(auth.IsAuthenticateInfulncer,auth.authorizeRole("admin"), Data.getAllUsers)

// get single user
User.route("/get-single-user/:id").get(auth.IsAuthenticateInfulncer, Data.getSingleUser) 

// forget password
User.route("/forgot-password").post(Data.ForgotPassword)
// reset password with OTP
User.route("/reset-password-with-otp").post(Data.resetPasswordWithOTP)

// check otp
User.route("/check-otp").post(Data.checkOTP)


// admin
// send mail to all user
User.route("/send-mail-to-all-users").post(auth.IsAuthenticateInfulncer,auth.authorizeRole("admin"),Data.sendEmailToAllUsers)

module.exports = User 