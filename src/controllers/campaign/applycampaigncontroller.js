// const Campaign = require("../../../model/brand/campaign/campaign");
// const Trycatch = require("../../middleware/Trycatch");
const ApplyInCampaign = require("../../models/campaign/ApplyInCampaign.js");
const User = require("../../models/influencerModel.js");
const Campaign = require("../../models/campaignModel.js");
const InfluencerSocialMedia = require("../../models/influencersocailMedia.js");
const InfluencerBankDetails = require("../../models/influ/infulbankdetails.js");
// mails
const sendPaymentNotification = require("../../utils/emails/payment/paymentemail.js");
const sendPaymentScheduleEmail = require("../../utils/emails/payment/trangectionemail.js");

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// create apply
const ApplyCampaign = async (req, res, next) => {
  const now = new Date(); // Get current date and time

  const Data = {
    influ_id: req.user.id,
    level: req.user.level,
    Noof_influencer: "1",
    category_id: req.body.content_type,
    client_id: req.body.client_id,
    campaign_no: req.body.campaign_no,
    amount: req.body.amount,
    influ_approval: "Pending",
    availability: "",
    content: "",
    content_upload_date: "",
    post_link: "",
    approval: "",
    content_approved: "",
    submition: "",
    change_reason: "",
    opt_date: formatDate(now),
    accept_date: "",
    content_approved_date: "",
    cam_complt_date: "",
    submit_date: "",
    pay_scedule_date: "",
    rewards: "",
    transaction_id: "",
  };

  try {
    // Save to the database using the formatted Data object
    const apply = await ApplyInCampaign.create(Data);
    res.status(200).json({
      success: true,
      message: "Applied successfully.",
      apply,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// get my apply

const GetMyApply = async (req, res, next) => {
  try {
    let apply;
    const influId = req.user.id;
    const submitionQuery = req.query.submition;

    if (submitionQuery === "yes" || submitionQuery === "active") {
      apply = await ApplyInCampaign.find({
        influ_id: influId,
        influ_approval: { $nin: ["Pending", "Rejected", "pending", "rejected"] },
        submition: { $nin: ["Completed", "completed"] }
      })    
    } else if (submitionQuery === "no") {
      apply = await ApplyInCampaign.find({
        influ_id: influId,
        influ_approval: { $nin: ["Pending", "Rejected", "pending", "rejected"] }
      });
    } else if (submitionQuery === "completed") {
      apply = await ApplyInCampaign.find({
        influ_id: influId,
        submition: { $in: ["Completed", "completed"] }
      });
    } else if (submitionQuery === "Pending") {
      apply = await ApplyInCampaign.find({
        influ_id: influId,
        influ_approval: { $in: ["Pending", "pending"] }
      });
    } else if (submitionQuery === "Rejected") {
      apply = await ApplyInCampaign.find({
        influ_id: influId,
        influ_approval: { $in: ["Rejected", "rejected"] }
      });
    }

    const applyWithCampaignDetails = await Promise.all(
      apply.map(async (application) => {
        const campaignDetails = await Campaign.findOne({ campaign_no: application.campaign_no });
        return {
          ...application._doc,
          campaignDetails,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: applyWithCampaignDetails.length,
      apply: applyWithCampaignDetails.reverse(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// get all apply by campaign id
const GetAllApplyByCampaignId = async (req, res, next) => {
  
  try {
    const applyEntries = await ApplyInCampaign.find({
      campaign_no: req.params.id,
    });

    const campaign = await Campaign.findOne({ campaign_no: req.params.id });

    const applyWithUserDetails = await Promise.all(
      applyEntries.map(async (apply) => {
        const user = await User.findOne({ id: apply.influ_id });

        if (!user) {
          return {
            ...apply._doc,
            user: null,
          };
        }

        const socialMedia = await InfluencerSocialMedia.findOne({
          influ_soc_link: user?.influ_soc_link,
        });

        return {
          ...apply._doc,
          user: {
            ...user._doc,
            socialMedia,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: applyWithUserDetails.length,
      campaign,
      applyUsers: applyWithUserDetails.reverse(),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




const EditApplyCampaign = async (req, res, next) => {
  try {
    const { campaign_no, influ_id } = req.params;
    const campaign = await Campaign.findOne({ campaign_no });
    const applydetails = await ApplyInCampaign.findOne( { campaign_no, influ_id });
    const campaigninflu_reward_days =campaign.reward_days;
    const campaignPrice = parseFloat(campaign.price);
    const currentDate = new Date(); 
    
    const { content, post_link, productRs, infAmount, rewards, total } = req.body;
    console.log("rewards",rewards);
    let updateFields = req.body;

    if (content) { 
      updateFields = {
        ...updateFields,
        content_upload_date: new Date().toISOString(),
        approval: "Pending" || "pending",
        content_approved: " ",
        content_approved_date: " ",
        content,
      };
    }

    if (post_link) {
      updateFields = {
        ...updateFields,
        submition: "Completed" || "completed",
        cam_complt_date: new Date().toISOString(),
        post_link,
      };

      const rewardDeadline = new Date(applydetails.opt_date);
      

      rewardDeadline.setDate(rewardDeadline.getDate() + campaigninflu_reward_days);
      if (currentDate <= rewardDeadline) {
        // User is eligible for 10% reward
        const rewardAmount = (campaignPrice * 0.10);  
        updateFields = {
          ...updateFields, 
          rewards: rewardAmount,  
        };
      }
    }  

    // if (productRs) {
    //   console.log("productRs: ", productRs);
    //   updateFields = {
    //     ...updateFields,
    //     product_price: productRs, 
    //   };
    // }

    if (infAmount) {
      console.log("infAmount: ", infAmount);
      updateFields = {
        ...updateFields,
        amount: infAmount, 
      };
    }

    if (rewards) {
      updateFields = {
        ...updateFields,
        rewards: rewards,
      };
    }

    // Update total if provided
    if (total) {
      updateFields = {
        ...updateFields,
        payment: total,
      };
    }

    // Perform update in the database
    const apply = await ApplyInCampaign.findOneAndUpdate(
      { campaign_no, influ_id },
      updateFields,
      { new: true }
    );

    if (!apply) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      apply,
    });

    // Additional logic after update
    const UserDetails = await User.findOne({ id: apply.influ_id });
    const campaignDetails = await Campaign.findOne({
      campaign_no: apply.campaign_no,
    });
       // find Influencerbankdetails
       const Influencerbankdetailsdata = await InfluencerBankDetails.findOne({
        influe_id: apply.influ_id,
      }); 
 
    const payscdlemail = UserDetails.email;
    const curpaydate = new Date().toISOString();
    const payscdlinflulevel = UserDetails.level || "";
    const payscdlinfluname = UserDetails.user_name || "";
    const payscdlcampaignno = apply.campaign_no || "";
    const payscdlcampaignname = campaignDetails.campaign_name || "";
    const payscdlproduct = campaignDetails.product || "";
    const payscdlcontent = apply.content || "";
    const transactionid = apply.transaction_id || "";
    const payscdlamount = Number(apply.amount) || 0;
    const payrewards = Number(apply.rewards) || 0;
    const productprice = Number(campaignDetails.product_price) || 0;

    // Send notification when payment is scheduled
    if (
      (apply.influ_approval === "Accepted" || apply.influ_approval === "accepted") &&
      (apply.content_approved === "Accepted" || apply.content_approved === "accepted") &&
      (apply.submition === "Completed" || apply.submition === "completed") &&
      apply.pay_scedule_date &&
      !apply.transaction_id
    ) {
      await sendPaymentScheduleEmail({
        payscdlamount,
        productprice,
        payscdlemail,
        payscdlinflulevel,
        payscdlinfluname,
        payscdlcampaignno,
        payscdlcampaignname,
        payscdlproduct,
        payscdlcontent,
        payrewards,
        maindate: apply.opt_date,
        payscdlbankname: Influencerbankdetailsdata.bankname || "",
        payscdlaccnum: Influencerbankdetailsdata.accountnumber || "",
        payscdlifsc: Influencerbankdetailsdata.ifsccode || "",
      });
    }

    // Send notification when payment is done
    if (
      (apply.influ_approval === "Accepted" || apply.influ_approval === "accepted") &&
      (apply.content_approved === "Accepted" || apply.content_approved === "accepted") &&
      (apply.submition === "Completed" || apply.submition === "completed") &&
      apply.pay_scedule_date &&
      apply.transaction_id
    ) {
      await sendPaymentNotification({
        payscdlemail,
        curpaydate,
        payscdlinflulevel,
        payscdlinfluname,
        payscdlcampaignno,
        payscdlcampaignname,
        payscdlproduct,
        payscdlcontent,
        transactionid,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// const EditApplyCampaign = async (req, res, next) => {
//   try {
//     const { campaign_no, influ_id } = req.params;
//     const { content, post_link } = req.body;
//     let updateFields = req.body;
 
//     if (content) {
//       updateFields = {
//         ...updateFields,
//         content_upload_date: new Date().toISOString(),
//         approval: "Pending" || "pending",
//         content_approved: " ",
//         content_approved_date: " ",
//         content,
//       };
//     }

//     if (post_link) {
//       updateFields = {
//         ...updateFields,
//         submition: "Completed" || "completed",
//         cam_complt_date: new Date().toISOString(),
//         post_link,
//       };
//     }

//     const apply = await ApplyInCampaign.findOneAndUpdate(
//       { campaign_no, influ_id },
//       updateFields,
//       { new: true }
//     );

//     if (!apply) {
//       return res.status(404).json({
//         success: false,
//         message: "Application not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Application updated successfully",
//       apply,
//     });

//     const UserDetails = await User.findOne({ id: apply.influ_id });
//     const campaignDetails = await Campaign.findOne({
//       campaign_no: apply.campaign_no,
//     });

//     const payscdlemail = UserDetails.email;
//     const curpaydate = new Date().toISOString();
//     const payscdlinflulevel = UserDetails.level || "";
//     const payscdlinfluname = UserDetails.user_name || "";
//     const payscdlcampaignno = apply.campaign_no || "";
//     const payscdlcampaignname = campaignDetails.campaign_name || "";
//     const payscdlproduct = campaignDetails.product || "";
//     const payscdlcontent = apply.content || "";
//     const transactionid = apply.transaction_id || "";
//     const payscdlamount = Number(apply.amount) || 0;
//     const productprice = Number(campaignDetails.product_price) || 0;

//     // Send notification when payment is scheduled
//     if (
//       apply.influ_approval === "Accepted" || apply.influ_approval === "accepted" &&
//       apply.content_approved === "Accepted" || apply.content_approved === "accepted"  &&
//       apply.submition === "Completed" || apply.submition === "completed" &&
//       apply.pay_scedule_date &&
//       !apply.transaction_id
//     ) {
//       await sendPaymentScheduleEmail({
//         payscdlamount,
//         productprice,
//         payscdlemail,
//         payscdlinflulevel,
//         payscdlinfluname,
//         payscdlcampaignno,
//         payscdlcampaignname,
//         payscdlproduct,
//         payscdlcontent,
//         maindate: apply.opt_date,
//         payscdlaccholder: "test place holder",
//         payscdlbankname: "test bank",
//         payscdlaccnum: "test acc number",
//         payscdlifsc: "test ifsc",
//       });
//     }

//     // Send notification when payment is done
//     if (
//       apply.influ_approval === "Accepted" || apply.influ_approval === "accepted" &&
//       apply.content_approved === "Accepted" || apply.content_approved === "accepted" &&
//       apply.submition === "Completed" || apply.submition === "completed" &&
//       apply.pay_scedule_date &&
//       apply.transaction_id
//     ) {
   
//       await sendPaymentNotification({
//         payscdlemail,
//         curpaydate,
//         payscdlinflulevel,
//         payscdlinfluname,
//         payscdlcampaignno,
//         payscdlcampaignname,
//         payscdlproduct,
//         payscdlcontent,
//         transactionid,
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// create apply
const AppplyCampaign = async (req, res, next) => {
  try {
    // req.body.influ_id = req.user.id;
    const apply = await ApplyInCampaign.create(req.body);
    res.status(200).json({
      success: true,
      apply,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const Applysummary = async (req, res, next) => {
  try {
    const influId = req.user.id;
    const Totalapply = await ApplyInCampaign.countDocuments({ influ_id: influId });
    const TotalPending = await ApplyInCampaign.countDocuments({ influ_id: influId, influ_approval: { $in: ["Pending", "pending"] } });
    const TotalRejected = await ApplyInCampaign.countDocuments({ influ_id: influId, influ_approval: { $in: ["Rejected", "rejected"] } });
    const TotalAccepted = await ApplyInCampaign.countDocuments({ influ_id: influId, influ_approval: { $in: ["Accepted", "accepted"] }, submition: "" });
    const Totalsubmition = await ApplyInCampaign.countDocuments({ influ_id: influId, submition: { $in: ["Completed", "completed"] }, influ_approval: { $in: ["Accepted", "accepted"] } });

    res.status(200).json({
      success: true,
      Totalapply,
      TotalPending,
      TotalRejected,
      TotalAccepted,
      Totalsubmition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const ApplysummaryOld = async (req, res, next) => {
  try {
    // req.body.influ_id = req.user.id;
    const Totalapply = await ApplyInCampaign.countDocuments({
      influ_id: req.user.id,
    });
    const TotalPending = await ApplyInCampaign.countDocuments({
      influ_id: req.user.id,
      influ_approval: "Pending" || "pending",
    });
    const TotalRejected = await ApplyInCampaign.countDocuments({
      influ_id: req.user.id,
      influ_approval: "Rejected" || "rejected",
    });
    const TotalAccepted = await ApplyInCampaign.countDocuments({
      influ_id: req.user.id,
      influ_approval: "Accepted" || "accepted",
      submition: "",
    });
    // submition
    const Totalsubmition = await ApplyInCampaign.countDocuments({
      influ_id: req.user.id,
      submition: "Completed" || "completed",
      influ_approval: "Accepted" || "accepted",
    });

    res.status(200).json({
      success: true,
      Totalapply ,
      TotalPending,
      TotalRejected,
      TotalAccepted,
      Totalsubmition,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const GetMyApplyByCampaignId = async (req, res, next) => {
  try {
    const apply = await ApplyInCampaign.findById(req.params.id);
    if (!apply) {
      return res.status(404).json({
        success: false,
        message: "Apply not found",
      });
    }
    res.status(200).json({
      success: true,
      apply,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const EarningSummary = async (req, res) => {
  try {
    const { year } = req.params;

    // Fetch all completed campaigns for the user
    const allCampaigns = await ApplyInCampaign.find({
      submition: { $in: ["Completed", "completed"] },  
      influ_id: req.user.id,
    });


    // Function to get the year from a date string
    const getYearFromDateString = (dateString) => {
      if (!dateString || dateString === '0000-00-00 00:00:00') {
        return null;
      }
      const date = new Date(dateString);
      return isNaN(date.getFullYear()) ? null : date.getUTCFullYear();
    };

    // Filter campaigns by the specified year
    const filteredCampaigns = allCampaigns.filter((campaign) => {
      let completionYear = getYearFromDateString(campaign.cam_complt_date);

      if (!completionYear) {
        // If cam_complt_date is invalid, use pay_scedule_date
        completionYear = getYearFromDateString(campaign.pay_scedule_date);
      }

      return completionYear === parseInt(year, 10);
    });


    // Organize filtered data by month
    const monthlyData = filteredCampaigns.reduce((acc, campaign) => {
      const month = new Date(campaign.cam_complt_date || campaign.pay_scedule_date).getUTCMonth() + 1; // Get month index starting from 1

      if (!acc[month]) {
        acc[month] = {
          month,
          totalCampaigns: 0,
          totalCompleted: 0,
          totalRejected: 0,
          totalPayment: 0,
          totalPendingPayment: 0,
        };
      }

      acc[month].totalCampaigns += 1;
      if (campaign.submition === "Completed" || campaign.submition === "completed") acc[month].totalCompleted += 1;
      if (campaign.influ_approval === "Rejected" || campaign.influ_approval === "rejected") acc[month].totalRejected += 1;

      // Check for total payments
      if (campaign.transaction_id && campaign.transaction_id !== "") {
        acc[month].totalPayment +=
          Number(campaign.amount) + Number(campaign.rewards);
      }

      // Check for pending payments
      if (
        (campaign.submition === "Completed" || campaign.submition === "completed") &&
        campaign.pay_scedule_date &&
        !campaign.transaction_id
      ) {
        acc[month].totalPendingPayment +=
          Number(campaign.amount) + Number(campaign.rewards);
      }

      return acc;
    }, {});

    // Fetch additional details for each campaign
    const campaignDetails = await Promise.all(
      filteredCampaigns.map(async (campaign) => {
        const campaignDetail = await Campaign.findOne({
          campaign_no: campaign.campaign_no,
        });
        return {
          ...campaign._doc,
          campaignDetails: campaignDetail,
        };
      })
    );

    const monthlySummary = Object.values(monthlyData);

    res.status(200).json({
      success: true,
      year,
      monthlyData: monthlySummary,
      campaignDetails,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const EarningSummaryOld = async (req, res) => {
  try {
    const { year } = req.params;

    // Fetch all completed campaigns for the user
    const allCampaigns = await ApplyInCampaign.find({
      submition: { $in: ["Completed", "completed"] },  
      influ_id: req.user.id,
    });


    // Filter campaigns by the specified year
    const filteredCampaigns = allCampaigns.filter((campaign) => {
      const completionYear = new Date(
        campaign.cam_complt_date
      ).getUTCFullYear();
      return completionYear === parseInt(year, 10);
    });

    // Organize filtered data by month
    const monthlyData = filteredCampaigns.reduce((acc, campaign) => {
      const month = new Date(campaign.cam_complt_date).getUTCMonth() + 1; // Get month index starting from 1

      if (!acc[month]) {
        acc[month] = {
          month,
          totalCampaigns: 0,
          totalCompleted: 0,
          totalRejected: 0,
          totalPayment: 0,
          totalPendingPayment: 0,
        };
      }

      acc[month].totalCampaigns += 1;
      if (campaign.submition === "Completed" || campaign.submition === "completed" ) acc[month].totalCompleted += 1;
      if (campaign.influ_approval === "Rejected" || campaign.influ_approval === "rejected" ) acc[month].totalRejected += 1;

      // Check for total payments
      if (campaign.transaction_id && campaign.transaction_id !== "") {
        acc[month].totalPayment +=
          Number(campaign.amount) + Number(campaign.rewards);
      }

      // Check for pending payments
      if (
        (campaign.submition === "Completed" || campaign.submition === "completed") &&
        campaign.pay_scedule_date &&
        !campaign.transaction_id
      ) {
        acc[month].totalPendingPayment +=
          Number(campaign.amount) + Number(campaign.rewards);
      }

      return acc;
    }, {});

    // Fetch additional details for each campaign
    const campaignDetails = await Promise.all(
      filteredCampaigns.map(async (campaign) => {
        const campaignDetail = await Campaign.findOne({
          campaign_no: campaign.campaign_no,
        });
        return {
          ...campaign._doc,
          campaignDetails: campaignDetail,
        };
      })
    );

    const monthlySummary = Object.values(monthlyData);

    res.status(200).json({
      success: true,
      year,
      monthlyData: monthlySummary,
      campaignDetails,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




module.exports = {
  ApplyCampaign,
  GetMyApply,
  GetAllApplyByCampaignId,
  AppplyCampaign,
  EditApplyCampaign,
  GetMyApplyByCampaignId,
  Applysummary,
  EarningSummary,
};
