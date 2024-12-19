const mongoose = require("mongoose");

const identitySchema = new mongoose.Schema({
    id : {
        type: String
    },
    influe_id: {
        type: String
    },
    adhar_front: {
        type: String,
    },
    adhar_back: {
        type: String,
    },
    pan_no: {
        type: String,
    },
    pan: {
        type: String,
    },
    other_proof1: {
        type: String,
    },
    other_proof2: {
        type: String,
    },

}, { timestamps: true });

module.exports = mongoose.model("influencer_identity", identitySchema)
