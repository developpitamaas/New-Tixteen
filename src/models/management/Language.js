
// id
// "2"
// language
// "Hindi"

const mongoose = require("mongoose");

// Define the language schema
const languageSchema = new mongoose.Schema({
    id: {
        type: String,
        // required: true
    },
    language: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("language", languageSchema)