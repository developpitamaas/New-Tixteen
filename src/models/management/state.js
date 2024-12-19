const mongoose = require("mongoose");

// Define the state schema
const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("state", stateSchema)  