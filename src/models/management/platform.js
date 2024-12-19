// name
// "Youtube"
// btn_name
// "Subscriber"

const mongoose = require('mongoose');

// Define the platform schema
const platformSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    btn_name: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("platform_list", platformSchema)