const mongoose = require("mongoose");


// leave_from
// "2023-10-20 12:03:07.000000"
// leave_to
// "2023-10-20 12:03:32.000000"
// staff_id
// "Shubham Vashisht"


const shortleaveSchema = new mongoose.Schema({
    leave_from: {
        type: String,
    },
    leave_to: {
        type: String,
    },
    staff_id: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("short_leave", shortleaveSchema)