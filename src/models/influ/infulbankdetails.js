// {"id":"0","influencerid":"2379","accholdername":"","bankname":"Hdfc bank ","accountnumber":"50100604297531","ifsccode":"HDFC0000900","swiftcode":"","phone":"9665500866","verify":"Pending","bankdate":"15-Aug-24 11:32:10"}

const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    id : {
        type: String
    },
    influe_id: {
        type: String
    },
    accholdername: {
        type: String,
    },
    bankname: {
        type: String,
    },
    accountnumber: {
        type: String,
    },
    ifsccode: {
        type: String,
    },
    swiftcode: {
        type: String,
    },
    phone: {
        type: String,
    },
    verify: {
        type: String,
    },
    bankdate: {
        type: Date,
    },
}, { timestamps: true }); 

module.exports = mongoose.model("influencer_bank_account", bankSchema)