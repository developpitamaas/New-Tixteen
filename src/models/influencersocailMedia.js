
const mongoose = require('mongoose');

const InfluencerSocailMediaSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        // required: true
    },
    link: {
        type: String,
        // required: true
    },
    follower: {
        type: String,
        // required: true
    },
    avgrange: {
        type: String,
        // required: true
    },
    verify: {
        type: String,
        // required: true
    },
    influ_soc_link: {
        type: String,
        // required: true
    }
});


module.exports = mongoose.model('influ_platforms', InfluencerSocailMediaSchema)