// routes/campaignRoutes.js

const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController.js');
const ApplyCampaign = require('../controllers/campaign/applycampaigncontroller.js');
const CampignFollow = require('../controllers/campaign/followerrequiredcontroller.js');
// const DeliverableData  = require('../controllers/campaignDeliverableController.js');
const FollowerRequired = require('../controllers/followerRequiredCampaignController.js');
const Auth = require('../middleware/Auth.js');
// GET all campaigns 
router.get('/campaigns', campaignController.getAllCampaigns);

// GET campaign by ID
router.get('/campaigns/:id',Auth.IsAuthenticateInfulncer ,campaignController.getCampaignById);
router.get('/campaign-id-for-admin/:id',Auth.IsAuthenticateInfulncer ,campaignController.getCampaignByIdForAdmin);
router.get('/campaign/details/:id', campaignController.getsingleCampaignDetails);
router.put('/campaign/update/:id', campaignController.updateCampaign);
router.delete('/campaign/delete/:id', campaignController.deleteCampaign);
// create campaign 
router.post('/create-campaign', campaignController.createCampaign);
router.get('/all-campaigns-for-admin', campaignController.GetAllCampaignsforAdmin);
router.get('/apply-campaign-details/campaign/:id', ApplyCampaign.GetAllApplyByCampaignId);
router.post('/apply-campaign',Auth.IsAuthenticateInfulncer ,ApplyCampaign.ApplyCampaign);

 
// Deliverable
// router.post('/create-deliverable', DeliverableData.createDeliverable);

// follower required
router.post('/create-required-follower', FollowerRequired.createCampaign);

// influencer
router.get('/influencer/all-campaigns-for-influncers',Auth.IsAuthenticateInfulncer ,campaignController.GetAllCampaignsforInfluncers);
router.get("/influencer/my-apply-campaigns", Auth.IsAuthenticateInfulncer, ApplyCampaign.GetMyApply);
router.put('/influencer/edit-apply-campaign/:influ_id/:campaign_no', ApplyCampaign.EditApplyCampaign);
router.get('/influencer/my-apply-campaigns/campaign/:id', ApplyCampaign.GetMyApplyByCampaignId);
router.get('/influencer/get-apply-summary', Auth.IsAuthenticateInfulncer, ApplyCampaign.Applysummary);
router.get('/influencer/earning/:year',Auth.IsAuthenticateInfulncer ,ApplyCampaign.EarningSummary);

// Follower
router.post('/create-required-follower', CampignFollow.createRequiredFollower);
router.get('/all-required-follower', CampignFollow.getAllRequiredFollowers);
router.get('/required-follower/campaign/:campaign_no', CampignFollow.getRequiredFollowersByCampaignNo);

module.exports = router;
 