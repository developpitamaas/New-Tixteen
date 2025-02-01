const express = require("express");
const Client = express.Router();
const Data = require("../controllers/client/form");


Client.post("/submit-brand", Data.sendbrandmail);

module.exports = Client;
