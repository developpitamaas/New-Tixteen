const Level = require("../../models/management/Level");
const Trycatch = require("../../middleware/trycatch");


// Create a new level
const createLevel = Trycatch(async (req, res) => {
    const level = await Level.create(req.body);
    res.status(200).json({
        success: true,
        data: level,
        message: "Level created successfully",
    });
});

// Update a level
const updateLevel = Trycatch(async (req, res) => {
    const level = await Level.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: level,
        message: "Level updated successfully",
    });
});

// Delete a level
const deleteLevel = Trycatch(async (req, res) => {
    const level = await Level.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: level,
        message: "Level deleted successfully",
    });
});
// Get all levels
const getAllLevels = Trycatch(async (req, res) => {
    const levels = await Level.find();
    res.status(200).json({
        success: true,
        data: levels,
        message: "Levels fetched successfully",
    });
});

// Get level by id
const getLevelById = Trycatch(async (req, res) => {
    const level = await Level.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: level,
        message: "Level fetched successfully",
    });
});


module.exports = { createLevel, updateLevel, deleteLevel, getAllLevels, getLevelById }