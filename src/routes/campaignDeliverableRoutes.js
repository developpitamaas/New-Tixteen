// routes/campaignDeliverableRoutes.js

const express = require('express');
const Deliverable = express.Router();
const campaignDeliverableController = require('../controllers/campaignDeliverableController');

// Get all deliverables
// const getAllDeliverablesRoute = router.get('/campaign_deliverable', campaignDeliverableController.getAllDeliverables);
// Get deliverable by _id using POST method
Deliverable.get('/campaign_deliverable/:id', campaignDeliverableController.getDeliverableById);
Deliverable.post('/campaign/deliverable', campaignDeliverableController.createDeliverable);
Deliverable.put('/campaign/deliverable/:id', campaignDeliverableController.updateDeliverable);
Deliverable.delete('/campaign/deliverable/:id', campaignDeliverableController.deleteDeliverable);


module.exports = Deliverable
