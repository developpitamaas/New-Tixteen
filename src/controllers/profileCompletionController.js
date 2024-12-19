const Influencer = require('../models/influencerModel.js');
// const uploadIntroVideo = require('../utils/uploadIntroVideo.js');

// Controller function for completing profile
exports.completeProfile = async (req, res) => {
  const {
    profile_img,
    pin_code,
    country,
    state,
    city,
    gender,
    dob,
    language,
    address,
    primary_platforms,
    intro_video,
    skip_intro_video,
    user_Id // Assuming userId is provided in the request body
  } = req.body;

  try {
    // Retrieve the influencer document
    let influencer = await Influencer.findById(user_Id);

    if (!influencer) {
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }

    // Update profile details
    influencer.profile_img = profile_img;
    influencer.pin_code = pin_code;
    influencer.country = country;
    influencer.state = state;
    influencer.city = city;
    influencer.gender = gender;
    influencer.dob = dob;
    influencer.language = language;
    influencer.address = address;
    influencer.primary_platforms = primary_platforms;

    // Upload intro video if provided
    if (!skip_intro_video && intro_video) {
      // const introVideoUrl = uploadIntroVideo(intro_video);
      influencer.intro_video = intro_video;
    }

    // Save changes to the influencer document
    await influencer.save();

    res.status(200).json({ success: true, message: 'Profile completed successfully' });
  } catch (error) {
    console.error('Error completing profile:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
