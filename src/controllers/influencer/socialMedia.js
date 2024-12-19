const SocialMedia = require("../../models/influencersocailMedia");
const Influencer = require("../../models/influencerModel");
const Trycatch = require("../../middleware/trycatch");
const { v4: uuidv4 } = require("uuid");

// const createSocialMedia = Trycatch(async (req, res, next) => {
//   const socialMediaData = req.body;

//   // Process each social media data item in the array
//   const createdSocialMedia = await Promise.all(socialMediaData.map(async (data) => {
//     // Generate a new UUID as the ID
//     const newId = uuidv4();
//     console.log(socialMediaData)
//     // Create new social media document with UUID as id
//     return await SocialMedia.create({
//       ...socialMediaData,
//       id: newId,
//     });
//   }));

//   res.status(200).json({
//     success: true,
//     data: createdSocialMedia,
//     message: "Social media created successfully",
//   });
// });
const addSocialMediaLink = Trycatch(async (req, res, next) => {
  const { id, platform, link, follower, influ_soc_link } = req.body;

  const newSocialMedia = new SocialMedia({
    id,
    platform,
    link,
    follower,
    influ_soc_link,
  });

  await newSocialMedia.save();

  res.status(201).json({
    success: true,
    data: newSocialMedia,
    message: "Social media link added successfully",
  });
});


const createSocialMedia = Trycatch(async (req, res, next) => {
  const socialMediaData = req.body;

  // Process each social media data item in the array
  const createdSocialMedia = await Promise.all(
    socialMediaData.map(async (data) => {
      // Generate a new UUID as the ID
      const newId = uuidv4();
      // Create new social media document with UUID as id
      return await SocialMedia.create({
        ...data, // Spread the data object, not socialMediaData
        id: newId,
        influ_soc_link: newId,
      });
    })
  );

  res.status(200).json({
    success: true,
    data: createdSocialMedia,
    message: "Social media created successfully",
  });
});

// get my social media
const getMySocialMedia = Trycatch(async (req, res, next) => {
  // const { id } = req.params;
  const socialMedia = await SocialMedia.find({ id: req.user.influ_soc_link });
  res.status(200).json({
    success: true,
    data: socialMedia,
    message: "Social media fetched successfully",
  });
});
// get social medai by id
const getSocialMediaById = Trycatch(async (req, res, next) => {
  const { id } = req.params;
  const socialMedia = await SocialMedia.findOne({ influ_soc_link: id });
  if (!socialMedia) {
    return res.status(404).json({
      success: false,
      message: "Social media not found",
    });
  }
  res.status(200).json({
    success: true,
    data: socialMedia,
    message: "Social media fetched successfully",
  });
});

// const getALlSocialMediabyId = Trycatch(async (req, res, next) => {
//   console.log(req.params.id)

//   const socialMedia = await SocialMedia.find({ influ_soc_link: req.params.id });
//   console.log(socialMedia)
//   res.status(200).json({
//     success: true,
//     data: socialMedia,
//     message: "Social media fetched successfully",
//   });
// });
const getALlSocialMediabyId = Trycatch(async (req, res, next) => {
  const ids = req.params.id; 
  
  // Split the IDs if they are a string
  const idArray = ids.split(',');

  console.log(idArray);

  // Fetch social media entries matching the IDs
  const socialMedia = await SocialMedia.find({ influ_soc_link: { $in: idArray } });

  console.log(socialMedia);
  
  res.status(200).json({
    success: true,
    data: socialMedia,
    message: "Social media fetched successfully",
  });
});

const updateMySocialMedia = Trycatch(async (req, res, next) => {
  const { link, platform, follower, avgrange, verify } = req.body;

  // Ensure required fields are provided
  if (!link) {
    return res.status(400).json({
      success: false,
      message: "Link is required",
    });
  }

  // Find the social media entry by user ID or some identifier
  const socialMedia = await SocialMedia.findOne({
    id: req.user.influ_soc_link,
  });

  if (!socialMedia) {
    return res.status(404).json({
      success: false,
      message: "Social media entry not found",
    });
  }

  // Update the social media entry with the new data
  socialMedia.link = link;
  socialMedia.platform = platform || socialMedia.platform;
  socialMedia.follower = follower || socialMedia.follower;
  socialMedia.avgrange = avgrange || socialMedia.avgrange;
  socialMedia.verify = verify || socialMedia.verify;

  // Save the updated social media entry
  await socialMedia.save();

  res.status(200).json({
    success: true,
    data: socialMedia,
    message: "Social media updated successfully",
  });
});
const updateUserSocialMediaById = Trycatch(async (req, res, next) => {
  const { link, platform, follower, avgrange, verify } = req.body;

  // Ensure required fields are provided
  if (!link) {
    return res.status(400).json({
      success: false,
      message: "Link is required",
    });
  }

  // Find the social media entry by user ID or some identifier
  const socialMedia = await SocialMedia.findOne({ id: req.params.id });

  if (!socialMedia) {
    return res.status(404).json({
      success: false,
      message: "Social media entry not found",
    });
  }

  // Update the social media entry with the new data
  socialMedia.link = link;
  socialMedia.platform = platform || socialMedia.platform;
  socialMedia.follower = follower || socialMedia.follower;
  socialMedia.avgrange = avgrange || socialMedia.avgrange;
  socialMedia.verify = verify || socialMedia.verify;

  // Save the updated social media entry
  await socialMedia.save();

  res.status(200).json({
    success: true,
    data: socialMedia,
    message: "Social media updated successfully",
  });
});

const updateSocialMediaLink = Trycatch(async (req, res, next) => {
  const { id } = req.params;
  const { link, follower } = req.body;

  const updatedSocialMedia = await SocialMedia.findByIdAndUpdate(
    id,
    { link, follower },
    { new: true }
  );

  if (!updatedSocialMedia) {
    return res.status(404).json({
      success: false,
      message: "Social media link not found",
    });
  }

  res.status(200).json({
    success: true,
    data: updatedSocialMedia,
    message: "Social media link updated successfully",
  });
});
const deleteSocialMediaLink = Trycatch(async (req, res, next) => {
  const { id } = req.params;

  const deletedSocialMedia = await SocialMedia.findByIdAndDelete(id);

  if (!deletedSocialMedia) {
    return res.status(404).json({
      success: false,
      message: "Social media link not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Social media link deleted successfully",
  });
});

module.exports = {
  createSocialMedia,
  getMySocialMedia,
  updateMySocialMedia,
  updateUserSocialMediaById,
  getSocialMediaById,
  getALlSocialMediabyId,
  deleteSocialMediaLink,
  updateSocialMediaLink,
  addSocialMediaLink
};
