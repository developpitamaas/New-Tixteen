const Influencer = require('../models/influencerModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Trycatch = require('../middleware/trycatch.js');
const OTPModel = require('../models/otpModel.js');

// Function to send a JWT token
const sendToken = (influencer, statusCode, res) => {
  const token = jwt.sign({ id: influencer._id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE}d` // Token expiration from environment variable
  });

  res.status(statusCode).json({
    success: true,
    token,
    msg: 'Signup successfully',
  });
}; 

// Function to generate OTP 
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
};
// Function to send email with OTP
const sendEmailVerificationOTP = async (email, otp) => {
  // Create a Nodemailer transporter with Gmail SMTP service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sachingautam6239@gmail.com', // Your Gmail email address
      pass: 'nxajuvwkblihqind' // Your Gmail password (use app password if two-factor authentication is enabled)
    }
  });

  // Define email options
  const mailOptions = {
    from: '"Sachin Gautam 👻" <sachingautam6239@gmail.com>', // Sender's email address and name
    to: email, // Recipient's email address
    subject: 'Email Verification OTP', // Email subject
    text: `Your OTP for email verification is: ${otp}` // Email body with OTP
  };

  // Send the email using the transporter
  await transporter.sendMail(mailOptions);
};

// Controller function to handle user signup
exports.signupUser = Trycatch(async (req, res, next) => {
    console.log(req.body)
  const { user_name, mobile, email, password } = req.body;

  // Check if all required fields are provided
  if (!user_name || !mobile || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide user_name, phone number, email, and password",
    });
  }

  // Check if email is already registered
  const existingUser = await Influencer.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists. Please use a different email",
    });
  }

  // Check if mobile number is already registered
  const existingMobile = await Influencer.findOne({ mobile });
  if (existingMobile) {
    return res.status(400).json({
      success: false,
      message: "Phone number already exists. Please use a different phone number",
    });
  }

   // Generate OTP
   const otp = generateOTP();

   // Save OTP to MongoDB collection
   await OTPModel.create({ email, otp });
 
   // Send email with OTP for verification
   try {
     await sendEmailVerificationOTP(email, otp);
   } catch (error) {
     console.error('Error sending email:', error);
     return res.status(500).json({
       success: false,
       message: "Failed to send email verification OTP. Please try again later"
     });
   }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new influencer
  const newInfluencer = await Influencer.create({
    user_name,
    mobile,
    email,
    password: hashedPassword,
  });

  // Send JWT token
  sendToken(newInfluencer, 201, res);
});
