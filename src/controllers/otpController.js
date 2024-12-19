// otpController.js
const OTPModel = require('../models/otpModel.js');
const sendEmailVerificationOTP = require('../utils/sendEmailVerificationOTP.js');

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate a new OTP
    const newOTP = Math.floor(1000 + Math.random() * 9000);

    // Check if the user already has an existing OTP document
    let otpDoc = await OTPModel.findOne({ email });

    // If OTP document exists, update it with the new OTP
    if (otpDoc) {
      otpDoc.otp = newOTP;
      await otpDoc.save();
    } else {
      // If OTP document doesn't exist, create a new one
      otpDoc = await OTPModel.create({ email, otp: newOTP });
    }

    // Send the new OTP to the user via email
    await sendEmailVerificationOTP(email, newOTP);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });
  } catch (error) {
    console.error('Error resending OTP:', error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again later"
    });
  }
};
