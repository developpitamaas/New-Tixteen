const Trycatch = require("../../middleware/trycatch.js");
const User = require('../../models/influencerModel.js');
const Mailer = require("../../utils/sendEmailVerificationOTP.js");
const { generateOTP, sendOTP, verifyOTP } = require("../../utils/otp.js");
const {handleError} = require("../../utils/errorHandel.js");

// otp verification
var OTPs = {};

const SendOTP = Trycatch(async (req, res, next) => {
  const { email , number } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide email",
    })
  }
  // check user us exist or not
  const user = await User.findOne({ email }); 
  const mobileNumber = await User.findOne({ mobile: number });

  if (user) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    })
  }
  if (mobileNumber && mobileNumber.mobile === number) {
    return res.status(400).json({
      success: false,
      message: "Mobile number already exists",
    })
  }

  // send otp
  const OTP = await generateOTP();
  OTPs[email] = OTP;

  // send otp via email
  const otpSender = await sendOTP(email, OTP);
  if (!otpSender) {
    // return handleError(res, 500, "Failed to send OTP");
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    })
  }

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
});

// verify otp
const OTPVerified = Trycatch(async (req, res, next) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return handleError(res, 400, "Please provide email and otp");
  }
  //     check if otp is valid
  const isOTPvalid = verifyOTP(email, otp);
  if (!isOTPvalid) {
    return handleError(res, 400, "Invalid OTP");
  }
  //     if otp is valid
  res.status(200).json({
    success: true,
    message: "OTP verified",
  });
});



// // forgot password
// // forgot password

// // Generate OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000);
// };
// // otp
// var OTPs = {};

// // send otp and update password
// const ForgotPassword = Trycatch(async (req, res, next) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   // check user us exist or not
//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//     });
//   }
//   // generate otp
//   const OTP = generateOTP();
//   OTPs[email] = OTP;

//   // send otp
//   try {
//     const generateEmailContent = (otp) => `
// <!DOCTYPE html>
// <html lang="en">

// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <link rel="preconnect" href="https://fonts.googleapis.com">
//   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
//   <link href="https://fonts.googleapis.com/css2?family=Sura:wght@400;700&display=swap" rel="stylesheet">
//   <title>Password Reset</title>
// </head>

// <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;   font-family: Sura, serif; font-weight: 400; font-style: normal; width: 100%; ">
//   <div style="position: relative;background-color: white; border: 1px solid #232F6D; border-radius: 10px; padding: 30px; padding-bottom: 15px; padding-top: 64px; max-width: 500px; text-align: center; height: 400px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
//     <div>
//       <img src="https://res.cloudinary.com/dtakusspm/image/upload/v1724484115/uffc8a6nzd13s0zfiik9.png" alt="SK Foods"
//         style="width: 170px; position: absolute; top: -45px; left: 50%; transform: translateX(-50%);">
//     </div>
//     <p style="font-size: 20px; margin: 0; color: #AE7B37;">Dear ${user.firstName}</p>
//     <p style="font-size: 16px; margin: 8px 0; margin-top: 2px; color: #555; color: #AE7B37;">Please enter this code to
//       reset your
//       password</p>
//     <p style="font-size: 32px; margin: 20px 0; font-weight: bold; letter-spacing: 10px;">${otp}</p>
//     <p style="font-size: 16px; margin: 10px 0; color: #AE7B37;">Keeps visiting <span
//         style="font-weight: bold; color: #AE7B37;">SK Foods</span></p>
//     <p style="font-size: 16px; margin-top: 20px; color: #AE7B37;">Regards,<br><span style="font-size: 18px;">United &
//         Co.</span></p>
//   </div>
// </body>

// </html>
// `;
//     const subject = "Password Reset OTP";
//     // const message = `Your OTP for resetting the password is: ${OTP}. Please do not share this OTP with anyone.`;
//     const message = generateEmailContent(OTP);
//     await Mail(email, subject, message, true);

//     res.status(200).json({
//       success: true,
//       message: "OTP sent to your email",
//     });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send OTP",
//     });
//   }
// });

// // check otp
// const checkOTP = Trycatch(async (req, res, next) => {
//   const { email, OTP } = req.body;
//   if (OTPs[email] !== OTP) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid OTP",
//     });
//   } else {
//     // remove OTP
//     delete OTPs[email];
//   }

//   res.status(200).json({
//     success: true,
//     message: "OTP verified",
//   });
// });

// // reset password with OTP
// const resetPasswordWithOTP = Trycatch(async (req, res, next) => {
//   const { email, newPassword } = req.body;
//   const user = await User.findOne({ email });
//   // if user does not exist
//   if (!user) {
//     return res.status(404).json({
//       success: false,
//       message: "User not found",
//     });
//   }
//   // update password
//   user.password = newPassword;
//   await user.save();

//   res.status(200).json({
//     success: true,
//     message: "Password reset successfully",
//   });
// });







module.exports = { SendOTP, OTPVerified };
