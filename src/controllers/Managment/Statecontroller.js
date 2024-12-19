const State = require("../../models/management/state");
const Trycatch = require("../../middleware/trycatch");
const Country = require("../../models/management/country");

 
// Create a new state
const createState = Trycatch(async (req, res) => {
    const state = await State.create(req.body);
    res.status(200).json({
        success: true,
        data: state,
        message: "State created successfully",
    });
});

// get all state by country_id
const getAllStateByCountryId = Trycatch(async (req, res) => {
    const states = await State.find({ country_id: req.query.country_id });
    res.status(200).json({
        success: true,
        data: states,
        message: "States fetched successfully",
    });
});

// Update a state
const updateState = Trycatch(async (req, res) => {
    const state = await State.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: state,
        message: "State updated successfully",
    });
});

// Delete a state
const deleteState = Trycatch(async (req, res) => {
    const state = await State.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: state,
        message: "State deleted successfully",
    });
});


module.exports = { createState, getAllStateByCountryId, updateState, deleteState }