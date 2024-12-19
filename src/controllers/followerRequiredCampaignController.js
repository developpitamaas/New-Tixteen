// controllers/followerRequiredCampaignController.js
const FollowerRequiredCampaign = require('../models/followerRequiredCampaignModel.js');
const Trycatch = require('../middleware/trycatch.js');

// Get all campaigns
const getAllCampaigns = Trycatch(async (req, res) => {
    const campaigns = await FollowerRequiredCampaign.find();
    if (!campaigns) {
        return res.status(404).json({ message: 'Campaigns not found' });
    }
    res.status(200).json({
        success: true,
        data: campaigns,
        message: 'Campaigns fetched successfully',
    })
});
// Get a single campaign by campaign_no
 const getCampaignByCampaignNo = Trycatch(async (req, res) => {
    const { campaign_no } = req.body;
    const campaigns = await FollowerRequiredCampaign.find({ campaign_no });
    if (!campaigns || campaigns.length === 0) {
        return res.status(404).json({ success: false, message: 'No campaigns found for the specified campaign_no' });
    }
    if (!campaigns) {
        return res.status(404).json({ success: false, message: 'Campaign not found' });
    }
    res.status(200).json({ 
        success: true, 
        data: campaigns,
        message: 'Campaign fetched by campaign_no successfully',
    });
});

// Create a new campaign
 const createCampaign = Trycatch(async (req, res) => {
    const { platforms, followers, campaign_no } = req.body;

    const newCampaign = new FollowerRequiredCampaign({
        platforms,
        followers,
        campaign_no
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
});

// Update a campaign by ID
 const updateCampaign = Trycatch(async (req, res) => {
    const updatedCampaign = await FollowerRequiredCampaign.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!updatedCampaign) {
        return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(updatedCampaign);
});

// Delete a campaign by ID
 const deleteCampaign = Trycatch(async (req, res) => {
    const deletedCampaign = await FollowerRequiredCampaign.findByIdAndDelete(req.params.id);
    if (!deletedCampaign) {
        return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json({ message: 'Campaign deleted' });
});

module.exports = {
    getAllCampaigns,
    getCampaignByCampaignNo,
    createCampaign,
    updateCampaign,
    deleteCampaign
}