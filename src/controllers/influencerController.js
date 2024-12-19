const Influencer = require("../models/influencerModel.js");
const InfluencerSocialMedia = require("../models/influencersocailMedia.js");
const Trycatch = require("../middleware/trycatch.js");
const ApiFeatures = require("../utils/apifeature.js");
const ApplyInCampaign = require("../models/campaign/ApplyInCampaign");
const Campaign = require("../models/campaignModel.js");
const BankDetails   = require("../models/influ/infulbankdetails");
const Identity = require("../models/influ/influidentity");

// register influencer
const registerInfluencer = Trycatch(async (req, res, next) => {
  const influencer = await Influencer.create(req.body); 
  res.status(200).json({
    success: true,
    data: influencer,
    message: "Influencer registered successfully",
  });
});

const getAllInfluencers = Trycatch(async (req, res, next) => {
  const perPageData = req.query.perPage || 10;

  // Initialize ApiFeatures with the query and request parameters
  const features = new ApiFeatures(Influencer.find(), req.query)
    .search()
    .filterByLevel()
    .filterByverification("")
    .paginate(perPageData)
    .filterByGender()
    .filterByPrimaryPlatform()
    .filterByCountry()
    .filterByState()
    .filterByCity()
    .filterByLanguage() 
    .filterByIndustry()
    .filterByMultiLevel() 
    .filterById()
    .filterByPhone()
    // .sortByIdDesc();
    .sortByRegDateDesc();

 
  // Get the filtered influencers
  const influencers = await features.query;

  // Count total influencers based on the applied filters
  const TotalInfluencer = await Influencer.countDocuments(features.query.getFilter());

  // // Fetch social media data for each influencer
  // const influencersWithSocialMediaData = await Promise.all(
  //   influencers.map(async (influencer) => {
  //     const socialMedia = await InfluencerSocialMedia.findOne({
  //       // id: influencer.influ_soc_link,
  //       influ_soc_link: influencer.influ_soc_link,
  //     });
  //     return { ...influencer._doc, socialMedia };
  //   })
  // );
  // Fetch social media data for each influencer
const influencersWithSocialMediaData = await Promise.all(
  influencers.map(async (influencer) => {
    // Assuming influ_soc_link contains a comma-separated string of IDs
    const idArray = influencer.influ_soc_link.split(',');

    // Fetch social media entries matching the influencer's social media links
    const socialMedia = await InfluencerSocialMedia.find({
      influ_soc_link: { $in: idArray },
    });

    return { ...influencer._doc, socialMedia };
  })
);


  // Send the response
  res.status(200).json({
    success: true,
    dataCount: TotalInfluencer,
    data: influencersWithSocialMediaData,
    message: "Influencers fetched successfully",
  });
});

// count user by verification
const countUserByVerification = Trycatch(async (req, res, next) => {
  const countAlluser = await Influencer.countDocuments();
  const countPaninguser = await Influencer.countDocuments({ verification: "Social Media Verification Pending" });
  // Verified
  const countVerifieduser = await Influencer.countDocuments({ verification: "Verified" });
  // Rejected
  const countRejecteduser = await Influencer.countDocuments({ verification: "Rejected" });
  res.status(200).json({
    success: true,
    data: { countAlluser, countPaninguser, countVerifieduser, countRejecteduser },
    message: "User count fetched successfully",
  });

});

// Controller function to fetch an influencer by ID
const getInfluencerById = Trycatch(async (req, res, next) => {
  const { _id } = req.body; 
  const influencer = await Influencer.findById(_id);
  const socialMedia = await InfluencerSocialMedia.findOne({
   influ_soc_link: influencer.influ_soc_link,
  });

  if (!influencer) {
    return res.status(404).json({ message: "Influencer not found" });
  }
  var apply = await ApplyInCampaign.find({
    influ_id: influencer.id,
  });
  var BankData = await BankDetails.findOne({influe_id: influencer.id});
  const InfluencerIdentity = await Identity.findOne({influe_id: influencer.id});

  const applyWithCampaignDetails = await Promise.all(
    apply.map(async (application) => {
      const campaignDetails = await Campaign.findOne({
        campaign_no: application.campaign_no,
      });
      return {
        ...application._doc,
        campaignDetails,
      };
    })
  ); 
  res.status(200).json({
    success: true,
    data: influencer,
    socialMedia: socialMedia,
    BankDetails : BankData, 
    apply:applyWithCampaignDetails,
    InfluencerIdentity : InfluencerIdentity,
    
    message: "Influencer fetched by ID successfully",
  });
}); 

// vaibhav
const getAllInfluencersFilter = Trycatch(async (req, res, next) => {
  const { levels, industry, gender, country, state, city, language } = req.body;
  const filters = {};

  if (levels && levels.length > 0) filters.level = { $in: levels };
  if (industry && industry.length > 0) filters.industry = { $in: industry };
  if (gender && gender !== "both") {
    filters.gender = gender;
  }
  if (country && country.length > 0) filters.ship_country = { $in: country };
  if (state && state.length > 0) filters.ship_state = { $in: state };
  if (city && city.length > 0) filters.ship_city = { $in: city };
  if (language && language.length > 0) filters.language = { $in: language };

  const influencers = await Influencer.find(filters).limit();
  res.status(200).json({
    success: true,
    data: influencers,
    message: "Influencers fetched successfully",
  });
});


// edit influencer
const editInfluencer = Trycatch(async (req, res, next) => {
  const updteInfluencer = await Influencer.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )

  if (!updteInfluencer) {
    return res.status(404).json({ message: "Influencer not found" });
  }
  res.status(200).json({
    success: true,
    data: updteInfluencer,
    message: "Influencer updated successfully",
  });
});

module.exports = {
  getAllInfluencers,
  getInfluencerById,
  getAllInfluencersFilter,
  registerInfluencer,
  editInfluencer,
  countUserByVerification
};
