// controllers/campaignController.js

const Campaign = require("../models/campaignModel.js");
const Influencer = require("../models/influencerModel.js");
// const Trycatch = require('../middleware/trycatch.js');
// const Trycatch = require("../middleware/Trycatch");

const ApplyInCampaign = require("../models/campaign/ApplyInCampaign.js");
const CampaignDeliverable = require("../models/campaignDeliverableModel.js");
const FollowerRequiredCampaign = require("../models/followerRequiredCampaignModel.js");
const RequiredInfu = require("../models/campaign/requireinfulncer.js");


function generateUniqueId() {
  const now = new Date();
  
  // Format date components
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const millisecond = now.getMilliseconds().toString().padStart(3, '0');
  
  // Generate random number
  const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  
  // Combine them into a unique ID
  const uniqueId = `${year}${month}${day}${hour}${minute}${millisecond}${randomNum}`;
  
  return uniqueId;
}
const createCampaign = async (req, res) => {

  try {
    const highestIdUser = await Campaign.aggregate([
      { $match: { id: { $exists: true } } },
      { $project: { id: { $toInt: "$id" } } }, 
      { $sort: { id: -1 } },
      { $limit: 1 }
    ]);
  
    let lastUserId = 0;
    if (highestIdUser.length > 0) {
      lastUserId = highestIdUser[0].id;
    }
    
    var id = lastUserId + 1;

    const { deliverables, followers, ...campaignData } = req.body;

    // Create campaign
    const campaign = await Campaign.create({id,...campaignData});

    // Create multiple deliverables
    for (let deliverable of deliverables) {
      await CampaignDeliverable.create({
        campaign_no: campaign.campaign_no,
        deliverable: deliverable
      });
    }

    // Create multiple follower requirements
    // for (let follower of followers) {
    //   await FollowerRequiredCampaign.create({
    //     campaign_no: campaign.campaign_no,
    //     platforms: follower.platform,
    //     followers: follower.followers
    //   });
    // }
    for (let i = 0; i < followers.length; i++) {
      await FollowerRequiredCampaign.create({
        id: i.toString(), 
        // platforms: followers[i].platform, 
        platforms: followers[i].platform[0], 
        followers: followers[i].followers,
        campaign_no: campaign.campaign_no
      });
    }
    
    
    for (let influencer of req.body.influencerData) {
      const uniqueId = generateUniqueId();
    const data =  await RequiredInfu.create({
        campaign_no: campaign.campaign_no,
        id: uniqueId,
        level: influencer.level,
        noof_influencer: influencer.noof_influencer
      });
    }

    res.status(201).json({
      success: true,
      data: campaign,
      message: "Campaign created successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};





// GET all campaigns
const getAllCampaigns = async (req, res) => {
  try {
    // Fetch all campaigns with no limit
    const campaigns = await Campaign.find();
    res.status(200).json({
      success: true,
      data: campaigns.reverse(),
      message: "Campaigns fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET campaign by ID
const getCampaignByIdForAdmin = async (req, res) => { 
  try {
    
    const campaign = await Campaign.findById(req.params.id);
    const deliverables = await CampaignDeliverable.find({
      campaign_no: campaign.campaign_no,
    });
    const FollowerRequired = await FollowerRequiredCampaign.find({
      campaign_no: campaign.campaign_no,
    })
    
    const responseData = {
      ...campaign.toObject(), 
      deliverables,
      FollowerRequired,           
    };

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      message: "Campaign fetched successfully",
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getCampaignById = async (req, res) => { 
  try {
    
    const campaign = await Campaign.findById(req.params.id);
    const deliverables = await CampaignDeliverable.find({
      campaign_no: campaign.campaign_no,
    });
    const FollowerRequired = await FollowerRequiredCampaign.find({
      campaign_no: campaign.campaign_no,
    })

    const userApplied = await ApplyInCampaign.findOne({
      campaign_no: campaign.campaign_no,
      influ_id: req.user.id,
    });
    
    const responseData = {
      ...campaign.toObject(), 
      deliverables,
      FollowerRequired,
      // userApplied
      userApplied: !!userApplied, 

          
    };


    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      message: "Campaign fetched successfully",
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const GetAllCampaignsforAdmin = async (req, res) => {
  try {
    // Fetch all campaigns with no limit
    const campaigns = await Campaign.find();

    const campaignsData = await Promise.all(
      campaigns.map(async (campaign) => {
        const applyEntries = await ApplyInCampaign.countDocuments({
          campaign_no: campaign.campaign_no,
          influ_approval: "Pending",
        });
 
        const {
          _id,
          id,
          dead_line,
          campaign_name,
          product,
          platforms,
          platform_link, 
          language,
          client_id,
          created_date,
          campaign_no,
          approval,
          status,
          banner,
          gender,
        } = campaign.toObject();

        return {
          _id,
          id,
          dead_line,
          campaign_name,
          product,
          platforms,
          platform_link,
          language,
          client_id,
          created_date,
          campaign_no,
          approval,
          status,
          banner,
          gender,
          NewApplyRequest: applyEntries,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaignsData.reverse(),
      message: "Campaigns fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
      error: error.message,
    });
  }
};
const GetAllCampaignsforInfluncers = async (req, res) => {
  try {
    // Get the user's industries and create regex array
    const industries = req.user.industry.split(",").map((ind) => ind.trim());
    const regexArray = industries.map((ind) => new RegExp(`\\b${ind}\\b`, "i"));
    const campaignType = req.query.type || "";

    // Find campaigns that match the user's industries or have industry "all"
    let campaigns;
    if (!campaignType) {
      campaigns = await Campaign.find({
        $or: [
          { industry: { $in: regexArray } },
          { industry: "all" }
        ],
        status: { $ne: "Completed" },
        approval: "1"
      });
    } else {
      campaigns = await Campaign.find({
        $or: [
          { industry: { $in: regexArray } },
          { industry: "all" } 
        ],
        campaign_type: campaignType,
        status: { $ne: "Completed" },
        approval: "1"
      });
    }

    const campaignsData = await Promise.all(
      campaigns.map(async (campaign) => {
        const applyEntries = await ApplyInCampaign.countDocuments({
          campaign_no: campaign.campaign_no,
          influ_approval: "Accepted",
        });
        const deliverables = await CampaignDeliverable.find({
          campaign_no: campaign.campaign_no,
        }); 
        

        // Check if the user has applied to the campaign
        const userApplied = await ApplyInCampaign.findOne({
          campaign_no: campaign.campaign_no,
          influ_id: req.user.id,
        });

        const {
          _id,
          id,
          dead_line,
          campaign_name,
          product,
          platforms,
          platform_link,
          language,
          client_id,
          created_date,
          campaign_no,
          approval,
          status,
          banner,
          gender,
          industry,
          price,
        } = campaign.toObject();

        return {
          _id,
          id,
          dead_line,
          campaign_name,
          product,
          price,
          platforms,
          platform_link,
          language,
          client_id,
          created_date,
          campaign_no,
          approval,
          status,
          banner,
          gender,
          industry,
          applyEntries,
          deliverables,
          userApplied: !!userApplied, // Whether the user has applied
        };
      })
    );

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaignsData.reverse(),
      message: "Campaigns fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
      error: error.message,
    });
  }
};

const getsingleCampaignDetails = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ campaign_no: req.params.id});
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    res.status(200).json({data:campaign});
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// update 
const updateCampaign = async (req, res) => {
  try {
    // Assuming `req.params.id` is actually the campaign number
    const campaign_no = req.params.id;
    const campaignData = {
      product: req.body.product,
      campaign_name: req.body.campaign_name,
      industry: req.body.industry,
      hash_tag: req.body.hash_tag,
      age: req.body.age,
      till_age: req.body.till_age,
      gender: req.body.gender,
      remark: req.body.remark,
      platforms: req.body.platforms,
      platform_link: req.body.platform_link,
      profile_tag: req.body.profile_tag,
      to_do: req.body.to_do,
      not_todo: req.body.not_todo,
      product_price: req.body.product_price,
      price : req.body.price,
      dead_line: req.body.dead_line,
      is_screen_shots_required: req.body.is_screen_shots_required,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      approval: req.body.approval,
      influ_working_day: req.body.influ_working_day,
      reward_days: req.body.reward_days,
      banner: req.body.banner
    };

    const updatedCampaign = await Campaign.findOneAndUpdate(
      { campaign_no: campaign_no }, 
      campaignData,
      { new: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedCampaign,
      message: "Campaign updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    // Check if the ID is provided
    if (!req.params.id) {  
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      });
    }

    const campaign = await Campaign.findOneAndDelete({ campaign_no: req.params.id });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getAllCampaigns,
  getCampaignById,
  GetAllCampaignsforAdmin,
  createCampaign,
  GetAllCampaignsforInfluncers,
  getsingleCampaignDetails,
  updateCampaign,
  deleteCampaign,
  getCampaignByIdForAdmin
  
};
