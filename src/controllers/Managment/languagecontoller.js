const Language = require("../../models/management/Language");
const Trycatch = require("../../middleware/trycatch");


// Create a new language
const createLanguage = Trycatch(async (req, res) => {
req.body.id = Math.floor(Math.random() * 100) +2 + '' + Math.floor(Math.random() * 100) + 10;

    const language = await Language.create(req.body);
    res.status(200).json({
        success: true,
        data: language,
        message: "Language created successfully",
    });
});

// Update a language
const updateLanguage = Trycatch(async (req, res) => {
    const language = await Language.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: language,
        message: "Language updated successfully",
    });
});

// Delete a language
const deleteLanguage = Trycatch(async (req, res) => {
    const language = await Language.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: language,
        message: "Language deleted successfully",
    });
});

// Get all languages
const getAllLanguages = Trycatch(async (req, res) => {
    const languages = await Language.find();
    res.status(200).json({
        success: true,
        data: languages,
        message: "Languages fetched successfully",
    });
});

// Get language by id
const getLanguageById = Trycatch(async (req, res) => {
    const language = await Language.findById(req.params.id);
    res.status(200).json({
        success: true,
        data: language,
        message: "Language fetched successfully",
    });
});


module.exports = { createLanguage, updateLanguage, deleteLanguage, getAllLanguages, getLanguageById }