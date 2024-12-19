const mongoose = require("mongoose");

// Define the country schema
const countrySchema = new mongoose.Schema({
  sort_name: {
    type: String,
  },
  name: {
    type: String,
  },
  phone_code: {
    type: String,
  },
});

module.exports = mongoose.model("country", countrySchema)