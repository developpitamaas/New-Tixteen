const BankDetails = require("../../models/influ/infulbankdetails");
const { v4: uuidv4 } = require('uuid');

const Trycatch = require("../../middleware/trycatch");


const AddBankDetails = Trycatch(async (req, res, next) => {
    const bankData = req.body;
    const newId = uuidv4();
    bankData.id = newId
    bankData.influe_id = req.user.id
    const bank = await BankDetails.create(bankData);
    res.status(200).json({
        success: true,
        bank
    })
})


const getalluserBankDetails = Trycatch(async (req, res, next) => {
    const bank = await BankDetails.find();
    res.status(200).json({
        success: true,
        bank
    })
})


const getMyBankDetails = Trycatch(async (req, res, next) => {
    const bank = await BankDetails.findOne({ influe_id: req.user.id });
    res.status(200).json({
        success: true,
        bank
    })
})


// get by id
const getBankDetails = Trycatch(async (req, res, next) => {
    const bank = await BankDetails.findById({influe_id: req.params.id});
    res.status(200).json({
        success: true,
        bank
    })
})

// update 
const updateBankDetails = Trycatch(async (req, res, next) => {
    const bank = await BankDetails.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        bank
    })
})


// delete
const deleteBankDetails = Trycatch(async (req, res, next) => {
    const bank = await BankDetails.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        bank
    })
})



module.exports = {
    AddBankDetails,
    getalluserBankDetails,
    getMyBankDetails,
    getBankDetails,
    updateBankDetails,
    deleteBankDetails
}

