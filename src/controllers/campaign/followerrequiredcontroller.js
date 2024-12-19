const RequiredFollower = require("../../models/campaign/requiredFollower.js");
const Trycatch = require("../../middleware/trycatch.js");

// GET all campaigns
const getAllRequiredFollowers = Trycatch(async (req, res) => {
     const requiredFollowers = await RequiredFollower.find();
     if (!requiredFollowers) {
          return res.status(404).json({ message: 'Required followers not found' });
     }
    res.status(200).json({
         success: true,
         data: requiredFollowers,
         message: 'Required followers fetched successfully',
    })
});

// GET required followers by campaign_no
const getRequiredFollowersByCampaignNo = Trycatch(async (req, res) => {
    // const { campaign_no } = req.params.campaign_no;
    // console.log(req.params.campaign_no)
    const requiredFollowers = await RequiredFollower.find({ campaign_no:req.params.campaign_no });
    if (!requiredFollowers || requiredFollowers.length === 0) {
        return res.status(404).json({ success: false, message: 'No required followers found for the specified campaign_no' });
    }
    if (!requiredFollowers) {
        return res.status(404).json({ success: false, message: 'Required followers not found' });
    }
    res.status(200).json({
        success: true, 
        data: requiredFollowers,
        message: 'Required followers fetched by campaign_no successfully',
    })

});

// Create a new campaign
const createRequiredFollower = Trycatch(async (req, res) => {
    const { platforms, followers, campaign_no } = req.body;

    const newRequiredFollower = new RequiredFollower({
        platforms,
        followers,
        campaign_no
    });

    const savedRequiredFollower = await newRequiredFollower.save();
    res.status(201).json(savedRequiredFollower);
});


module.exports = { getAllRequiredFollowers, getRequiredFollowersByCampaignNo, createRequiredFollower }



