const OTPModel = require('../models/otpModel.js'); // Import the OTP model

// Controller for OTP verification
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const otpDoc = await OTPModel.findOne({ email, otp });
    if (!otpDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Remove the OTP document from the collection
    await OTPModel.deleteOne({ _id: otpDoc._id });

    // Here you can add additional logic for handling the successful verification

    res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again later"
    });
  }
};
