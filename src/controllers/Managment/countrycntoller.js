const Country = require("../../models/management/country");
const Trycatch = require("../../middleware/trycatch");

// Create a new city
const createCountry = Trycatch(async (req, res) => {
    const country = await Country.create(req.body);
    res.status(200).json({
        success: true,
        data: country,
        message: "Country created successfully",
    });
});

// Update a city
const updateCountry = Trycatch(async (req, res) => {
    const country = await Country.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: country,
        message: "Country updated successfully",
    });
});

// Delete a city
const deleteCountry = Trycatch(async (req, res) => {
    const country = await Country.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: country,
        message: "Country deleted successfully",
    });
});

// Get a city by ID
const getCountryById = Trycatch(async (req, res) => {
    const country = await Country.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: country,
        message: "Country fetched successfully",
    });
});

// Get all cities
const getAllCountries = Trycatch(async (req, res) => {
    const { sort_name } = req.query;

    // If sort_name is provided, find countries with that sort_name
    if (sort_name) {
        const countries = await Country.find({ sort_name });
        return res.status(200).json({
            success: true,
            data: countries,
            message: "Countries fetched successfully",
        });
    }

    // If sort_name is not provided, return all countries
    const countries = await Country.find({});
    return res.status(200).json({
        success: true,
        data: countries,
        message: "Countries fetched successfully.",
    });
});


module.exports = {
    getAllCountries,
    getCountryById,
    createCountry,
    updateCountry,
    deleteCountry,
}