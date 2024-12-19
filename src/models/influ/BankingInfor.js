
const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    influe_id: {
        type: String
    },
    bank_name: {
        type: String,
    },
    bank_account: {
        type: String,
    },
    IFSC: {
        type: String,
    },
    swift: {
        type: String,
    },
    link_phone_no: {
        type: String,
    },
    created_at: {
        type: Date,
    },

}, { timestamps: true });

module.exports = mongoose.model("payment_details", bankSchema)