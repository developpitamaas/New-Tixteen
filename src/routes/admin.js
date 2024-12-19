const express = require("express");
const Data = require("../controllers/admin/dashboard");
const Bill = require("../controllers/invoice/mybill");
const AdminRegister = require("../controllers/admin/adminregister");
const Admin = express.Router();
const PaymentData = require("../controllers/admin/payment/paymentschedule");
const Clinet = require("../controllers/admin/clinet/clientcontroller");
const InfuMessage  = require("../controllers/Managment/newcampignmessage")
const Auth = require("../middleware/Auth");

Admin.get("/get-campaign-summary", Data.GetCampaignSummary);
Admin.get ("/filtered-campaign-summary", Data.GetFilteredCampaigns);
Admin.get("/get-monthly-campaign-counts", Data.GetMonthlyCampaignCounts);

//Influencer
Admin.get("/get-influencer-summary", Data.GetInfluencerSummary);
Admin.get("/get-monthly-user-counts", Data.GetMonthlyUserCounts);
Admin.get("/get-user-counts-by-date", Data.GetUserCountsByDate);



// Bill
Admin.get("/get-my-bill", Bill.getMyBill); 
Admin.post("/create-my-bill", Bill.createMyBill);
Admin.put("/update-my-bill/:id", Bill.updateMyBill);
Admin.delete("/delete-my-bill/:id", Bill.deleteMyBill);
Admin.get("/get-my-bill/:id", Bill.getSingleMyBill);
 
// Bill item
Admin.post("/create-bill-items", Bill.createBillItems);
Admin.get("/get-bill-items", Bill.getAllBillItem);
Admin.put("/update-bill-items", Bill.updateBillItems);
Admin.delete("/delete-bill-items/:id", Bill.deleteBillItems);
 
// admin register
Admin.post("/create-admin", AdminRegister.CreateAdmin);  
Admin.get("/get-admin-details", Auth.IsAuthenticateUser,AdminRegister.GetAdminDetails);
Admin.put("/update-admin-details/:id", AdminRegister.UpdateAdmin);
Admin.delete("/delete-admin/:id", AdminRegister.DeleteAdmin);
Admin.get("/get-all-admins", AdminRegister.GetAllAdmins); 
Admin.post("/login-admin", AdminRegister.AdminLoginController);

// payment 
Admin.get("/get-all-pending-payments", PaymentData.getCampaignForPayment);


// client
Admin.get("/get-all-clients", Clinet.GetClientData);
Admin.post("/create-client", Clinet.CreateClientData);
Admin.put("/update-client/:id", Clinet.UpdateClientData);
Admin.delete("/delete-client/:id", Clinet.DeleteClientData);
Admin.get("/get-client-by-id/:id", Clinet.GetSingleClientData);


// send message 
Admin.post("/send-message", Auth.IsAuthenticateUser ,InfuMessage.SendMessage);


module.exports = Admin;
