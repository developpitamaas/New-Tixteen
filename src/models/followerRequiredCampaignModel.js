// models/FollowerRequiredCampaign.js
const mongoose = require('mongoose');

const FollowerRequiredCampaignSchema = new mongoose.Schema({
    platforms: {
        type: Array,
        required: true
    },
    followers: {
        type: Number,
        required: true
    },
    campaign_no: {
        type: String,
        required: true
    }
});




module.exports = mongoose.model('follower_required_campaign', FollowerRequiredCampaignSchema)