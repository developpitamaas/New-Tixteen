const express = require('express');
const router = express.Router();
const influencerController = require('../controllers/influencerController.js');

// Define the route to get all influencers
const getAllInfluencers = router.get('/influencers', influencerController.getAllInfluencers);

// // Define the route to get an influencer by ID
const getInfluencerById = router.post('/influencers', influencerController.getInfluencerById);

// getAllInfluencersFilter
 const getAllInfluencersFilter = router.post('/influencers/filter', influencerController.getAllInfluencersFilter);

//  edit 
const editInfluencer = router.put('/influencers/:id', influencerController.editInfluencer);

// get count
const countUserByVerification = router.get('/influencers/influencers-count', influencerController.countUserByVerification);

module.exports = {
    getAllInfluencers,
    getInfluencerById,
    getAllInfluencersFilter
    
};
