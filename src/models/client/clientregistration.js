const mongoose = require("mongoose");


// client_id
// "12"
// client_name
// "Swayam Jain "
// email_id
// "jainswayam53@gmail.com"
// phone_number
// "9582822192"
// pin_code
// ""
// nation
// "India"
// state
// "Punjab"
// company_name
// ""
// brand_name
// "Big Bicycle Hub "
// gst_no
// ""
// website
// "Www.bigbicyclehub.com"
// password
// "$2y$10$URKHH/8cPDVVWRBUW7LLx..ytLzIRgPWN2HViZZq8ViiRpGK0FWVi"
// created_date
// "06-May-22 23:58:30"
// profile_img
// "defaultuser.png"
// city
// "Dhuri"
// verified
// "yes"
// status
// "0"

const clientregistrationSchema = new mongoose.Schema({
    client_id: {
        type: String,
    },
    client_name: {
        type: String,
    },
    email_id: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    pin_code: {
        type: String,
    },
    nation: {
        type: String,
    },
    state: {
        type: String,
    },
    company_name: {
        type: String,
    },
    brand_name: {
        type: String,
    },
    gst_no: {
        type: String,
    },
    website: {
        type: String,
    },
    password: {
        type: String,
    },
    created_date: {
        type: String,
    },
    profile_img: {
        type: String,
    },
    city: {
        type: String,
    },
    verified: {
        type: String,
    },
    status: {
        type: String,
        default: "0"
        
    }

}, { timestamps: true });

module.exports = mongoose.model("client_registration", clientregistrationSchema)