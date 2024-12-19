const  express = require("express");
const Bank = express.Router();
const BankData = require("../../controllers/influencer/infuBanking");
const auth = require("../../middleware/Auth");

// crate bank
Bank.route("/create-bank").post(auth.IsAuthenticateInfulncer,BankData.createBank)
// get bank
Bank.route("/get-bank").get(auth.IsAuthenticateInfulncer,BankData.getBank)
// update bank detils 
Bank.route("/update-bank/:id").put(auth.IsAuthenticateInfulncer,BankData.updateBank)
// delete bank
Bank.route("/delete-bank/:id").delete(auth.IsAuthenticateInfulncer,BankData.deleteBank)
// get bank detils
Bank.route("/get-bank-detils/:id").get(auth.IsAuthenticateInfulncer,BankData.getBankDetils)
// get my bank 
Bank.route("/get-my-bank").get(auth.IsAuthenticateInfulncer,BankData.getMyBank)



module.exports = Bank

