// {"id":"0","influe_id":"1985","flatno":"","streetno":"","address":"Saheed Nagar BMC mall 640 plot no.","landmark":"Saheed Nagar BMC mall ","pincode":"751007","country":"","state":"","city":"","add_type":"1"},
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    id : {
        type: String
    },
    influe_id: {
        type: String
    },
    flatno: {
        type: String,
    },
    streetno: {
        type: String,
    },
    address: {
        type: String,
    },
    landmark: {
        type: String,
    },
    pincode: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    add_type: {
        type: String,
    },

}, { timestamps: true });

module.exports = mongoose.model("influ_address", addressSchema)
