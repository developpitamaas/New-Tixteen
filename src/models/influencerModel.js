const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');

// Define the influencer schema
const influencerSchema = new mongoose.Schema({
  id: String,
  user_name: String,
  gender: String,
  dob: String,
  age: String,
  profile_img: String,
  intro_video: String,
  language: String,
  level: String, 
  mobile: String,
  mobile_2: String,
  email: {
    type: String,
    required: true  
  },
  password: {
    type: String,
    required: true,
  },
  industry: String,
  content_type: String,
  visit: String,
  regs_date: String,  
  influ_soc_link: String,
  primary_platform: String,
  shipping_address: String,
  ship_country: String,
  ship_state: String,
  ship_city: String,
  ship_pin_code: String, 
  working_area: String,
  reject_mark: String,
  verification: String,
  approved_by: String,
  action_date: String,
  refrence: String,
  prime_content: String,
  whatsapp_connect: String,
  featured: String, 
  rating: String,
  sleep_mode: String,
  suspend: String,
  status: String,
  intro_video_link: String,
  primary_platforms: [String],
  created_at: Date,
});

influencerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  console.log('Original password before hashing:', this.password);
  
  this.password = await bcrypt.hash(this.password, 10);
  
  console.log('Hashed password:', this.password);
  next(); 
});

// influencerSchema.methods.comparePassword = async function(candidatePassword) { 
//   return await bcrypt.compare(candidatePassword, this.password);
// }; 
influencerSchema.methods.comparePassword = async function(candidatePassword) {
  const isHashed = this.password.startsWith('$2b$') || this.password.startsWith('$2a$') || this.password.startsWith('$2y$');

  if (isHashed) {
    return await bcrypt.compare(candidatePassword, this.password);
  } else {
    return candidatePassword === this.password;
  }
};

 
influencerSchema.methods.getJWTToken = function () {
  return jsonWebToken.sign(
    { id: this._id },
    "sachinpitamaasweb",
    { 
      expiresIn: "48h", // Set token expiration to 48 hours
    }
  );
};

const Influencer = mongoose.model('influencer', influencerSchema);

module.exports = Influencer;
