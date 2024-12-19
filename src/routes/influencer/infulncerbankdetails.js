const express = require("express");
const InfluencerBank = express.Router();
const BankData = require("../../controllers/influencer/infulncerBankdetails");
const InflIdentity = require("../../controllers/influencer/infulnceriddentity");
const auth = require("../../middleware/Auth");

// bank details
InfluencerBank.route("/add-bank-details").post(
  auth.IsAuthenticateInfulncer,
  BankData.AddBankDetails
);
InfluencerBank.route("/get-all-bank-details").get(
  auth.IsAuthenticateInfulncer,
  BankData.getalluserBankDetails
);
InfluencerBank.route("/get-infulncer-bank-details-by-id/:id").get(
  auth.IsAuthenticateInfulncer,
  BankData.getMyBankDetails
);
InfluencerBank.route("/get-my-bank-details").get(
  auth.IsAuthenticateInfulncer,
  BankData.getMyBankDetails
);
InfluencerBank.route("/update-bank-details/:id").put(
  auth.IsAuthenticateInfulncer,
  BankData.updateBankDetails
);
InfluencerBank.route("/delete-bank-details/:id").delete(
  auth.IsAuthenticateInfulncer,
  BankData.deleteBankDetails
);

// identity
InfluencerBank.route("/create-update-identity").post(
  auth.IsAuthenticateInfulncer, 
  InflIdentity.createIdentity
);
InfluencerBank.route("/update-identity").put(
  auth.IsAuthenticateInfulncer,
  InflIdentity.updateIdentity
);
InfluencerBank.route("/get-identity/:id?").get(
  auth.IsAuthenticateInfulncer,
  InflIdentity.getIdentity
);
InfluencerBank.route("/delete-identity").delete(
  auth.IsAuthenticateInfulncer,
  InflIdentity.deleteIdentity
);

module.exports = InfluencerBank; 
