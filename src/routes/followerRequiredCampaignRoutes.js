// routes/followerRequiredCampaignRoutes.js
const express = require('express');
const router = express.Router();
const followerRequiredCampaignController = require('../controllers/followerRequiredCampaignController.js');

const getAllCampaigns = router.get('/follower-required-campaign', followerRequiredCampaignController.getAllCampaigns);
const getCampaignById = router.post('/follower-required-campaign/campaign-by-id', followerRequiredCampaignController.getCampaignByCampaignNo);
const createCampaign = router.post('/follower-required-campaign', followerRequiredCampaignController.createCampaign);
const updateCampaign = router.put('/follower-required-campaign/:id', followerRequiredCampaignController.updateCampaign);
const deleteCampaign = router.delete('/follower-required-campaign/:id', followerRequiredCampaignController.deleteCampaign);

module.exports = {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign,
};
