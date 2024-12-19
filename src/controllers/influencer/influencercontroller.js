const Trycatch = require("../../middleware/trycatch");
const User = require("../../models/influencerModel");
const sendToken = require("../../utils/userToken");
const Mail = require("../../utils/sendEmailVerificationOTP");
// email and whatsapp
const verificationEmail = require("../../utils/wamail/verifiedusermessage");
const RegisterUserEmail = require("../../utils/emails/registermail");

// Register User

const RegisterUser = Trycatch(async (req, res, next) => {
  // check email
  const useremail = await User.findOne({ email: req.body.email });
  if (useremail) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }
  const video = req.body.formData.videoUrl ? req.body.formData.videoUrl : "";

  // Find the last user and get their ID
  const highestIdUser = await User.aggregate([
    { $match: { id: { $exists: true } } },
    { $project: { id: { $toInt: "$id" } } }, // Convert id to integer
    { $sort: { id: -1 } },
    { $limit: 1 },
  ]);

  let lastUserId = 0;
  if (highestIdUser.length > 0) {
    lastUserId = highestIdUser[0].id;
  }

  const newUserId = lastUserId + 1;
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const user = await User.create({
    id: newUserId.toString(),
    user_name: req.body.formData.username,
    mobile: req.body.formData.phone,
    email: req.body.formData.email,
    password: req.body.formData.password,
    ship_pin_code: req.body.formData.pin,
    ship_country: req.body.formData.country,
    shipping_address: req.body.formData.address,
    ship_state: req.body.formData.state,
    ship_city: req.body.formData.city,
    gender: req.body.formData.selectedGender,
    dob: req.body.formData.dob,
    language: req.body.formData.selectedLanguages,
    instaUser: req.body.formData.instaUser,
    youtubeUser: req.body.formData.youtubeUser,
    linkdinUser: req.body.formData.linkdinUser,
    twiterUser: req.body.formData.twiterUser,
    instaResult: req.body.formData.instaResult,
    youtubeResult: req.body.formData.youtubeResult,
    linkdinResult: req.body.formData.linkdinResult,
    twiterResult: req.body.formData.twiterResult,
    industry: req.body.formData.Industry,
    influ_soc_link: req.body.formData.influ_soc_link,
    verification: "Social Media Verification Pending",
    regs_date: currentDate,
    level: "1",
    intro_video_link: video,
    profile_img: req.body.formData.userprofile,
  });
  console.log("user", user);

  const message = RegisterUserEmail(user);
  const subject = "Welcome to Tixteen - Registration Successful!";

  await Mail(user.email, subject, message, true); // Send HTML email

  // send whatsapp message
  const Wamessage = `Hey ${user.username}\n\nYour application is in the spotlight now! We're verifying your profile for top-notch opportunities. A bit of anticipation, and you'll be all set! Thanks for choosing Tixteen!\n\nTixteen`;

  // console.log("Wamessage", Wamessage);
  sendToken(user, 200, res);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

// Login User
const LoginUser = Trycatch(async (req, res, next) => {
  const { email, password } = req.body;
  //   if there is no email and password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  //   check if user exists
  const user = await User.findOne({ email });
  // .select("+password");

  //   if user does not exist
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  //   if user exists
  const isMatch = await user.comparePassword(password);
  // if password does not match
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  sendToken(user, 200, res);
});

// my profile
const myProfile = Trycatch(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

// update user
const updateUser = async (req, res, next) => {
  try {
    // approved_by
    if (req.body.editUser.verification) {
      req.body.editUser.approved_by = req.user.user;
    }
    const { editUser } = req.body;

    if (!editUser) {
      return res.status(400).json({
        success: false,
        message: "No user data provided",
      });
    }

    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check for existing mobile number
    if (editUser.mobile && editUser.mobile !== user.mobile) {
      const mobileNumberCheck = await User.findOne({
        mobile: editUser.mobile,
      });
      if (mobileNumberCheck) {
        return res.status(400).json({
          success: false,
          message: "Mobile number already exists",
        });
      }
    }

    // Update user details
    Object.assign(user, editUser);
    await user.save(); // Save the updated user

    // Send account verification mail
    if (editUser.verification === "Verified") {
      console.log("Verified");
      await verificationEmail(user._id, editUser.verification);
    }

    if (editUser.verification === "Rejected") {
      console.log("Rejected");
      await verificationEmail(
        user._id,
        editUser.verification,
        editUser.reject_mark
      );
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateUserold = Trycatch(async (req, res, next) => {
  // const { editUser } = req.body;
  if (req.body.mobileNumber) {
    // find mobile number
    const mobileNumberCheck = await User.findOne({
      mobileNumber: req.body.mobileNumber,
    });
    if (mobileNumberCheck) {
      return res.status(400).json({
        success: false,
        message: "Mobile number already exists",
      });
    }
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  console.log("req.body.verification", req.body.verification);
  // send account verification mail
  if (req.body.verification == "Verified") {
    console.log("verifired");
    await verificationEmail(user._id, req.body.verification);
  }
  if (req.body.verification == "Rejected") {
    console.log("Rejected");

    await verificationEmail(
      user._id,
      req.body.verification,
      req.body.reject_mark
    );
  }
  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});

// get all users
const getAllUsers = Trycatch(async (req, res, next) => {
  // check cache
  const users = await User.find();
  const totalUsers = users.length;
  res.status(200).json({
    success: true,
    totalUsers,
    users,
  });
});

// delete user
const deleteUser = Trycatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  await user.remove();
  // remove cache
  // cache.del("users");
  // cache.del("totalUsers");

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// get single user
const getSingleUser = Trycatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// forgot password

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
// otp
var OTPs = {};

// send otp and update password
const ForgotPassword = Trycatch(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  // check user us exist or not
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  // generate otp
  const OTP = generateOTP();
  OTPs[email] = OTP;

  // send otp
  try {
    await Mail(
      email,
      "Password Reset OTP",
      `Your OTP for resetting the password is: ${OTP}. Please do not share this OTP with anyone.`
    );
    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// check otp
const checkOTP = Trycatch(async (req, res, next) => {
  const { email, OTP } = req.body;
  if (OTPs[email] !== OTP) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  } else {
    // remove OTP
    delete OTPs[email];
  }

  res.status(200).json({
    success: true,
    message: "OTP verified",
  });
});

// reset password with OTP
const resetPasswordWithOTP = Trycatch(async (req, res, next) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });
  // if user does not exist
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  // update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

// Send Email to All Registered Users
const sendEmailToAllUsers = Trycatch(async (req, res, next) => {
  const { template } = req.body;
  // Fetch all registered users
  const users = await User.find();

  // Check if there are any users
  if (users.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No users found",
    });
  }

  let emailsSentCount = 0;

  // Send email to each user
  for (let user of users) {
    await Mail(
      user.email,
      "Test email from vaibhav ",
      "This is testing email from Sk-Food E-com.",
      template
    );
    emailsSentCount++;
  }

  res.status(200).json({
    success: true,
    message: "Email sent to all registered users",
    usersCount: users.length,
    emailsSentCount: emailsSentCount,
  });
});

// export all
module.exports = {
  RegisterUser,
  LoginUser,
  myProfile,
  updateUser,
  getAllUsers,
  deleteUser,
  getSingleUser,
  ForgotPassword,
  resetPasswordWithOTP,
  sendEmailToAllUsers,
  checkOTP,
};
