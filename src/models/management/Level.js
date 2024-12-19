
// id
// "1"
// level
// "1"
// followers
// "5k"
// avrg_followers
// "12000"
// broad_cast_influencer
// "100"
// image_influencer
// "100"
// video_influencer
// "200"
// client_broad_cast
// "1000"
// client_video
// "1500"
// client_image
// "700"
// status
// "1"

const mongoose = require("mongoose");

// Define the level schema
const levelSchema = new mongoose.Schema({
    id: {
        type: String,
        // required: true
    },
    level: {
        type: String,
        // required: true
    },
    followers: {
        type: String,
        // required: true
    },
    avrg_followers: {
        type: String,
        // required: true
    },
    broad_cast_influencer: {
        type: String,
        // required: true
    },
    image_influencer: {
        type: String,
        // required: true
    },
    video_influencer: {
        type: String,
        // required: true
    },
    client_broad_cast: {
        type: String,
        // required: true
    },
    client_video: {
        type: String,
        // required: true
    },
    client_image: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        // required: true
    }
});

module.exports = mongoose.model("influencer_levels", levelSchema)