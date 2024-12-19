const mongoose = require("mongoose");


const attendanceSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    staff_id: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    minute: {
        type: String,
        required: true
    },
    leave: {
        type: String,
        required: true
    },
    // status: {
    //     type: String,
    //     default: "on leave"
    // },

}, { timestamps: true });

module.exports = mongoose.model("attendance", attendanceSchema)