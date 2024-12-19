const  mongoose = require('mongoose');

// Define the city schema
const citySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    state_id : {
        type: String,
    }
});

module.exports = mongoose.model('cities', citySchema)