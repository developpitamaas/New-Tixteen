const PlateForm = require('../../models/management/platform');

const Trycatch = require('../../middleware/trycatch');

// Create a new PlateForm
const createPlatform = Trycatch(async (req, res) => {
    const platform = await PlateForm.create(req.body);
    res.status(200).json({
        success: true,
        data: platform,
        message: "Platform created successfully",
    });
});

// Update a PlateForm
const updatePlatform = Trycatch(async (req, res) => {
    const platform = await PlateForm.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: platform,
        message: "Platform updated successfully",
    });
});

// Delete a PlateForm
const deletePlatform = Trycatch(async (req, res) => {
    const platform = await PlateForm.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: platform,
        message: "Platform deleted successfully",
    });
});

// Get all PlateForm
const getAllPlatform = Trycatch(async (req, res) => {
    const platform = await PlateForm.find();
    res.status(200).json({
        success: true,
        data: platform,
        message: "Platforms fetched successfully",
    });
});

// Get a PlateForm
const getPlatformById = Trycatch(async (req, res) => {
    const platform = await PlateForm.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: platform,
        message: "Platform fetched successfully",
    });
});

module.exports = {
    createPlatform,
    updatePlatform,
    deletePlatform,
    getAllPlatform,
    getPlatformById
}