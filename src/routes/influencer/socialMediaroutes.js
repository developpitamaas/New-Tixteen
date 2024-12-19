const express = require("express");
const SocialMedia = express.Router();
const Data = require("../../controllers/influencer/socialMedia");
const auth = require("../../middleware/Auth");

SocialMedia.route("/create-social-media").post(Data.createSocialMedia);
SocialMedia.route("/get-my-social-media").get( auth.IsAuthenticateInfulncer, Data.getMySocialMedia);
SocialMedia.route("/get-social-media-by-user-id/:id").get( auth.IsAuthenticateInfulncer, Data.getALlSocialMediabyId);
// update 
SocialMedia.route("/update-my-social-media").put(auth.IsAuthenticateInfulncer, Data.updateMySocialMedia);
SocialMedia.route("/update-user-social-media-by-id/:id").put( Data.updateUserSocialMediaById);
// get by id 
SocialMedia.route("/get-social-media-by-id/:id").get( auth.IsAuthenticateInfulncer, Data.getSocialMediaById);


SocialMedia.route('/update-social-media/:id').put(Data.updateSocialMediaLink);
SocialMedia.route('/delete-social-media/:id').delete(Data.deleteSocialMediaLink);
SocialMedia.route('/add-social-media').post(Data.addSocialMediaLink);


module.exports = SocialMedia;


