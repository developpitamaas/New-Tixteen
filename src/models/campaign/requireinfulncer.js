

const mongoose = require("mongoose");
const requiredInfluencerSchema = new mongoose.Schema({
    id: {
        type: String
    },
    campaign_no: {
        type: String
    },
    level: {
        type: String
    },
    noof_influencer: {
        type: String
    }
})

module.exports = mongoose.model('influencer_required_in_campaign', requiredInfluencerSchema)