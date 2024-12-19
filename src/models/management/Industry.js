const  mongoose = require('mongoose');

// Define the Industry schema
const IndustrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status : {
        type: String,
        
    }
});

module.exports = mongoose.model('industries', IndustrySchema)