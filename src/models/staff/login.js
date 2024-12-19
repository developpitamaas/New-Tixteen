const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  user: {
    type: String,
    required: [true, "Please enter your username"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email already exists"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
});

// Encrypt password
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Json web token
// AdminSchema.methods.getJWTToken = function () {
//   return jsonWebToken.sign(
//     { id: this._id },
//     // process.env.JWT_SECRET
//     "sachinpitamaasweb",
//     {
//       expiresIn: "1222",
//     }
//   );
// };

AdminSchema.methods.getJWTToken = function () {
  return jsonWebToken.sign(
    { id: this._id },
    "sachinpitamaasweb",
    { 
      expiresIn: "8h", // Set token expiration to 1 hour
    }
  );
};


// Compare password
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}; 

module.exports = mongoose.model("admin", AdminSchema);
