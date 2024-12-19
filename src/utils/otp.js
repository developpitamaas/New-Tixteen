const Mail = require("./sendEmailVerificationOTP");

// Generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

// OTP storage
var OTPs = {};

// Send OTP via email
const sendOTP = async (email, OTP) => {
  try {
    const subject = "Tixteen verification OTP";
    
    // Convert OTP to a string and pad with leading zeros if needed
    const otpString = OTP.toString().padStart(4, '0');
    
    // Construct OTP display
    const otpDisplay = otpString.split('').map((digit, index) => {
      return `
        <div style="${index < otpString.length - 1 ? '; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif; ' : 'font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;'} padding: 5px;">
          ${digit}
        </div>
      `;
    }).join('');
    
    // Create email message with HTML content
    const message = `
      <div style="display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div style="max-width: 600px; overflow: hidden; margin: 0 auto; padding: 20px; border: 2px solid #FFD700; border-radius: 10px; font-family: Arial, sans-serif; background-color: #fff;">
          <div style="padding: 40px 20px;">
            <img src="https://res.cloudinary.com/dzvsrft15/image/upload/v1723462345/TixteenLogo_nzm33i.png" alt="Tixteen Logo" style="width: 120px; display: block; margin: 0 auto;">
            <h1 style="text-align: center; color: #000; font-size: 24px; margin-top: 20px;">Dear user,</h1>
            <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
              Thank you for registering with <strong>TIXTEEN</strong>. To complete your email verification, please use the following OTP:
            </p>
            
            <div style="display: flex; align-items: center; justify-content: space-evenly; width: 15%; padding: 0px 10px; text-align: center; border-bottom: 1px solid #000; gap: 20px; margin-left: 39% ">
              ${otpDisplay}
            </div>
            <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
              Please enter this OTP on the registration page to verify your email address. This OTP is valid for the next 15 minutes.
            </p>
            <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
              <strong> Important:</strong> Do not share this OTP with anyone for security reasons.
            </p>
            <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
              Thank you for choosing <strong>TIXTEEN</strong>.
            </p>
            <p style="text-align: center; color: #333; font-size: 16px; line-height: 1.5;">
              Best regards,<br>The Team <strong>TIXTEEN</strong>
            </p>
          </div>
        </div>
      </div>
    `;
    // Send email with HTML content
    await Mail(email, subject, message, true); // Send HTML email

    // Store the OTP
    OTPs[email] = OTP;
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

// Verify OTP
const verifyOTP = (email, userOTP) => {
  const storedOTP = OTPs[email];
  if (!storedOTP || storedOTP !== userOTP) {
    return false;
  }
  // OTP is valid, remove it from storage
  delete OTPs[email];
  return true;
};

module.exports = { generateOTP, sendOTP, verifyOTP };
