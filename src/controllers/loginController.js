const Influencer = require('../models/influencerModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Trycatch = require('../middleware/trycatch.js');

// Function to send a JWT token
const sendToken = (influencer, statusCode, res) => {
  const token = jwt.sign({ id: influencer._id }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRE}d` // Token expiration from environment variable
  });

  res.status(statusCode).json({
    success: true,
    token,
    _id: influencer._id,
    msg: 'Login successfully',
  });
}; 

exports.LoginUser = Trycatch(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  // Find the influencer by email
  const influencer = await Influencer.findOne({ email });
  // If influencer does not exist, return an error
  if (!influencer) {
    console.log('influencer not found');
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Check if the influencer's status is active
  if (influencer.status !== '1') {
    console.log('influencer not active');
    return res.status(401).json({
      success: false,
      message: "Your account is not active. Please contact support.",
    });
  }

  // Check if the password is correct
  const passwordMatch = await bcrypt.compare(password, influencer.password);
  // Compare the password provided by the user with the hashed password stored in the database
  if (password === influencer.password || passwordMatch) {
    // If passwords match, send the token
    sendToken(influencer, 200, res);
  } else {
    // If passwords do not match, return an error
    console.log('invalid password');
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
});



// const Influencer = require('../models/influencerModel.js');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const Trycatch = require('../middleware/trycatch.js');

// // Function to send a JWT token
// const sendToken = (influencer, statusCode, res) => {
//   // const token = jwt.sign({ id: influencer._id }, process.env.JWT_SECRET, {
//   const token = jwt.sign({ id: influencer._id }, "sachinpitamaasweb", {
//     // expiresIn: `${process.env.JWT_EXPIRE}d` 
//   });

//   res.status(statusCode).json({
//     success: true,
//     token,
//     _id: influencer._id,
//     influencer,
//     msg: 'Login successfully',
//   });
// };

// exports.LoginUser = Trycatch(async (req, res, next) => {
//   const { email, password } = req.body;
//   console.log(email, password);
//   // Check if email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide email and password",
//     });
//   }

//   // Find the influencer by email
//   const influencer = await Influencer.findOne({ email });
//   // If influencer does not exist, return an error
//   if (!influencer) {
//     console.log('influencer not found');
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }

//   // Check if the influencer's status is active
//   // if (influencer.status !== '1') {
//   //   console.log('influencer not active');
//   //   return res.status(401).json({
//   //     success: false,
//   //     message: "Your account is not active. Please contact support.",
//   //   });
//   // }

//   // Check if the password is correct
//   const passwordMatch = await bcrypt.compare(password, influencer.password);
//   // Compare the password provided by the user with the hashed password stored in the database
//   if (password === influencer.password || passwordMatch) {
//     // If passwords match, send the token
//     sendToken(influencer, 200, res);
//   } else {  

//     // If passwords do not match, return an error
//     console.log('invalid password');
//     return res.status(401).json({
//       success: false,
//       message: "Invalid email or password",
//     });
//   }
// });
 