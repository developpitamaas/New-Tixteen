// controllers/campaignDeliverableController.js

const CampaignDeliverable = require('../models/campaignDeliverableModel.js');
const Trycatch = require('../middleware/trycatch');


const createDeliverable = Trycatch(async (req, res) => {
    const deliverable = await CampaignDeliverable.create(req.body);
    res.status(201).json({
        success: true,
        data: deliverable,
        message: 'Deliverable created successfully',
    });
});

// Get all deliverables
exports.getAllDeliverables = Trycatch(async (req, res) => { 
    const deliverables = await CampaignDeliverable.find();
    res.status(200).json({
        success: true,
        data: deliverables,
        message: 'Deliverables fetched successfully',
    });
}); 


// Get deliverable by _id using POST method
const getDeliverableById  = Trycatch(async (req, res) => { 
    const campaign_no  = req.params.id;
    const deliverables = await CampaignDeliverable.find({ campaign_no });
    if (!deliverables || deliverables.length === 0) {
        return res.status(404).json({ success: false, message: 'Deliverables not found' });
    }
    res.status(200).json({ 
        success: true, 
        data: deliverables,
        message: 'Deliverables fetched by campaign_no successfully',
    });
});

// update 
const updateDeliverable = Trycatch(async (req, res) => {
    // find by campaign_no
    const id = req.params.id;
    // find by id and update
    const updatedDeliverable = await CampaignDeliverable.findByIdAndUpdate(id , req.body, { new: true });
   
    res.status(200).json({ 
        success: true, 
        data: updatedDeliverable,
        message: 'Deliverable updated successfully',
    });
});

// delete deliverable
const deleteDeliverable = Trycatch(async (req, res) => {
    const id = req.params.id;

    const deletedDeliverable = await CampaignDeliverable.findByIdAndDelete(id);
   
    res.status(200).json({ 
        success: true, 
        data: deletedDeliverable,
        message: 'Deliverable deleted successfully',
    });
});


module.exports = { createDeliverable , getDeliverableById , updateDeliverable , deleteDeliverable }