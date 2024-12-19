const City = require("../../models/management/city");
const Trycatch = require("../../middleware/trycatch");


// Create a new city
const createCity = Trycatch(async (req, res) => {
    const city = await City.create(req.body);
    res.status(200).json({
        success: true,
        data: city,
        message: "City created successfully",
    });
});

// Update a city
const updateCity = Trycatch(async (req, res) => {
    const city = await City.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: city,
        message: "City updated successfully",
    });
});

// Delete a city
const deleteCity = Trycatch(async (req, res) => {
    const city = await City.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: city,
        message: "City deleted successfully",
    });
});

// Get a city by ID
const getCityById = Trycatch(async (req, res) => {
    const city = await City.findOne({state_id : req.query.state_id});
    res.status(200).json({
        success: true,
        data: city,
        message: "City fetched successfully",
    });
});

// Get all cities
const getAllCities = Trycatch(async (req, res) => {
    const { name } = req.query;
    if (!name) {
        const cities = await City.find().limit(20);
        res.status(200).json({
            success: true,
            data: cities,
            message: "Cities fetched successfully",
        });
    }else{
        const cities = await City.find({ name});
        res.status(200).json({
            success: true,
            data: cities,
            message: "Cities fetched successfully",
        });
    }
});

module.exports = {
    getAllCities,
    getCityById,
    createCity,
    updateCity,
    deleteCity,
}