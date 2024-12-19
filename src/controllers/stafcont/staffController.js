const Addstaf = require("../../models/staff/addstaf");
const Trycatch = require("../../middleware/trycatch");


const AddStaf = Trycatch(async (req, res) => {
    const firstName = req.body.name.split(' ')[0]

    req.body.username = firstName;
    const staf = await Addstaf.create(req.body);
    res.status(200).json({
        success: true,
        data: staf,
        message: "Staf created successfully",
    });
})

const updateStaf = Trycatch(async (req, res) => {
    const staf = await Addstaf.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: staf,
        message: "Staf updated successfully",
    });
})

const deleteStaf = Trycatch(async (req, res) => {
    const staf = await Addstaf.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: staf,
        message: "Staf deleted successfully",
    });
})

const getStaf = Trycatch(async (req, res) => {
    const staf = await Addstaf.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: staf,
        message: "Staf fetched successfully",
    });
})

const getAllStaf = Trycatch(async (req, res) => {
    if (req.query.status) {
        const staf = await Addstaf.find({status: req.query.status});
        res.status(200).json({
            success: true,
            data: staf,
            message: "Staf fetched successfully",
        });
    }else{
        const staf = await Addstaf.find({status: "1"});
        res.status(200).json({
            success: true,
            data: staf,
            message: "Staf fetched successfully",
        });
    }
})

module.exports = { AddStaf, updateStaf, deleteStaf, getStaf, getAllStaf }