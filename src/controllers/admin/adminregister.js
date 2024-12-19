const AdminLogin = require("../../models/staff/login");
const Trycatch = require("../../middleware/trycatch");
const sendToken = require("../../utils/userToken");
const Addstaf = require("../../models/staff/addstaf");


// crate admin
const CreateAdmin = Trycatch(async (req, res) => {
  const admin = await AdminLogin.create(req.body);
  res.status(200).json({
    success: true,  
    data: admin,
    message: "Admin created successfully",
  });
}); 

// login
const AdminLoginController = Trycatch(async (req, res) => {
  const { user, password } = req.body;

  if (!user || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username and password",
    });
  }

  const admin = await AdminLogin.findOne({ user:user });
  if (!admin) {
    return res.status(400).json({
      success: false,
      message: "user not found",
    });
  }
const staff = await Addstaf.findOne({username:admin.user})

 console.log(staff)
  if(staff.status === "0"){
    return res.status(400).json({
      success: false,
      message: "user is not active", 
    });
  }
  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: ` Dear ${admin.user} this password is wrong`,
    });
  }
  
  sendToken(admin, 200, res);


  // res.status(200).json({
  //   success: true,
  //   data: admin,
  //   message: `welcome back ${admin.user} in Tixteen `,
  // });
});

// get user details
const GetAdminDetails = Trycatch(async (req, res) => {
  const userId = req.user._id;
  const admin = await AdminLogin.findById(userId);
  res.status(200).json({
    success: true,
    data: admin,
    message: "Admin details fetched successfully",
  });
});

// delete user
const DeleteAdmin = Trycatch(async (req, res) => {
  const admin = await AdminLogin.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: admin,
    message: "Admin deleted successfully",
  });
});

// update user
const UpdateAdmin = Trycatch(async (req, res) => {
  const admin = await AdminLogin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: admin,
    message: "Admin updated successfully",
  });
});

// get all users
const GetAllAdmins = Trycatch(async (req, res) => {
  const admin = await AdminLogin.find();
  res.status(200).json({
    success: true,
    count: admin.length,
    data: admin,
    message: "Admins fetched successfully",
  });
});

module.exports = {
  CreateAdmin,
  AdminLoginController,
  GetAdminDetails,
  DeleteAdmin,
  UpdateAdmin,
  GetAllAdmins,
};
