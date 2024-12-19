const mongoose = require("mongoose");

// id
// "1"

// platforms
// Array (1)
// followers
// "50"
// campaign_no
// "73202401269"


const requiredFollowerSchema = new mongoose.Schema({
    id: {
        type: String},
    platforms: {
        type: Array
    },
    followers: {
        type: String
    },
    campaign_no: {
        type: String
    }
});

module.exports = mongoose.model('follower_required_campaigns', requiredFollowerSchema)