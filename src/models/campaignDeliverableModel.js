
const mongoose = require('mongoose');

const CampaignDeliverableSchema = new mongoose.Schema({
    campaign_no: {
        type: String,
        required: true
    },
    deliverable: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('campaign_deliverables', CampaignDeliverableSchema);
