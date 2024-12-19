const  mongoose = require("mongoose");
const jsonWebToken = require("jsonwebtoken");

const staffSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    username :{
        type :String
    }, 
    mobile: {
        type: String,
    },
    fathername: { 
        type: String,
    },
    basicsalary: {
        type: String,
    },
    address: {
        type: String,
    },
    photo: {
        type: String,
    },
    dob: {
        type: String,
    },
    login: {
        type: String,
    },
    logout: {
        type: String,
    },
    email: {
        type: String,
    },
    status: {
        type: String,
        default: "1",
    },
    doj: {
        type: String,
    },

}, { timestamps: true });
staffSchema.methods.getJWTToken = function () {
    return jsonWebToken.sign(
      { id: this._id },
      "sachinpitamaasweb"
      //   , {
      //   expiresIn: process.env.JWT_EXPIRE,
      // }
    );
  };


module.exports = mongoose.model('add_staff', staffSchema)