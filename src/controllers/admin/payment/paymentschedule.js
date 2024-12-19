const ApplyInCampaign = require("../../../models/campaign/ApplyInCampaign");
const Campaign = require("../../../models/campaignModel"); // Assuming Campaign model is required
const Influencer = require("../../../models/influencerModel.js");


// const getCampaignForPayment = async (req, res, next) => {
//   try {
//     // Fetch all applications
//     let apply = [];
 
//     if (req.query.all === "yes") {
//       apply = await ApplyInCampaign.find();
    
//       // Filter applications based on criteria
//       var filteredApplications = apply.filter(
//         (application) =>
//           // application.submition === "Completed" &&
//           application.post_link &&
//           application.cam_complt_date &&
//           !application.pay_scedule_date
//       );
//     }
//     if (req.query.all === "schedule") {
      
//       apply = await ApplyInCampaign.find();

//       // Filter applications based on criteria
//       var filteredApplications = apply.filter(
//         (application) =>
//           // application.submition === "Completed" &&
//           // application.post_link &&
//           // application.cam_complt_date &&
//           application.pay_scedule_date &&
//           !application.transaction_id
//       );
//     }

//     if (req.query.all === "traction") {
//       apply = await ApplyInCampaign.find();

//       // Filter applications based on criteria
//       var filteredApplications = apply.filter(
//         (application) =>
//           // application.submition === "Completed" &&
//           // application.post_link &&
//           // application.cam_complt_date &&
//           application.pay_scedule_date &&
//           application.transaction_id
//       );
//     }

//     // Fetch campaign details for filtered applications
//     const applyWithCampaignDetails = await Promise.all(
//       filteredApplications.map(async (application) => {
//         const campaignDetails = await Campaign.findOne({
//           campaign_no: application.campaign_no,
//         });
//         return {
//           ...application._doc,
//           campaignDetails,
//         };
//       })
//     );

//     res.status(200).json({
//       success: true,
//       count: applyWithCampaignDetails.length,
//       apply: applyWithCampaignDetails.reverse(),
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };



const getCampaignForPayment = async (req, res, next) => {
  try { 
    let apply = [];

    if (req.query.all === "yes" || req.query.all === "schedule" || req.query.all === "traction") {
      apply = await ApplyInCampaign.find();

      let filteredApplications;
      if (req.query.all === "yes") {
        filteredApplications = apply.filter(
          (application) =>
            application.post_link &&
            application.cam_complt_date &&
            !application.pay_scedule_date
        );
      } else if (req.query.all === "schedule") {
        filteredApplications = apply.filter(
          (application) =>
            application.pay_scedule_date &&
            !application.transaction_id
        );
      } else if (req.query.all === "traction") {
        filteredApplications = apply.filter(
          (application) =>
            application.pay_scedule_date &&
            application.transaction_id
        );
      }

      const applyWithDetails = await Promise.all(
        filteredApplications.map(async (application) => {
          const campaignDetails = await Campaign.findOne({
            campaign_no: application.campaign_no,
          });
          const influencerDetails = await Influencer.findOne({
            id: application.influ_id,
          });
          return {
            ...application._doc,
            campaignDetails,
            influencerDetails,
          };
        })
      );

      res.status(200).json({
        success: true,
        count: applyWithDetails.length,
        apply: applyWithDetails.reverse(),
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid query parameter",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};



module.exports = {
  getCampaignForPayment,
};
