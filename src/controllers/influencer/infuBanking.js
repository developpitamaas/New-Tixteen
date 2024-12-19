const Baking = require("../../models/influ/BankingInfor");
const Trycatch = require("../../middleware/trycatch");

// crate bank
const createBank = Trycatch(async (req, res, next) => {
    const bankData = req.body;
    bankData.influe_id = req.user.id
    const bank = await Baking.create(bankData);
    res.status(200).json({
        success: true,
        bank
    })
})

// get bank
 const getBank = Trycatch(async (req, res, next) => {
    const bank = await Baking.find();
    res.status(200).json({
        success: true,
        bank
    })
})

// update bank detils 
const updateBank = Trycatch(async (req, res, next) => {
    const bank = await Baking.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        bank
    })
})

// delete bank
const deleteBank = Trycatch(async (req, res, next) => {
    const bank = await Baking.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        bank
    })
})

// get bank detils
const getBankDetils = Trycatch(async (req, res, next) => {
    const bank = await Baking.findById(req.params.id);
    res.status(200).json({
        success: true,
        bank
    })
}) 

// get my bank 
const getMyBank = Trycatch(async (req, res, next) => {
    const bank = await Baking.find({ influe_id: req.user.id });
    res.status(200).json({
        success: true,
        bank
    })
})

// export 
module.exports = {
    createBank,
    getBank,
    updateBank,
    deleteBank,
    getBankDetils,
    getMyBank
}