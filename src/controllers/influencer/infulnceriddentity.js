const Identiy = require("../../models/influ/influidentity");
const Trycatch = require("../../middleware/trycatch");
const User = require("../../models/influencerModel");


// create identity
const createIdentity = Trycatch(async (req, res, next) => {

    req.body.influe_id = req.user.id
    // if data exist then update otherwise add new 

    const identity = await Identiy.findOne({ influe_id: req.user.id });

    if (identity) {
        const updatedIdentity = await Identiy.findOneAndUpdate(
            { influe_id: req.user.id },
            req.body,
            { new: true }
        );
        res.status(200).json({
            success: true,
            data: updatedIdentity,
            message: "Identity updated successfully",
        });
    } else {
        const identity = await Identiy.create(req.body);
        res.status(201).json({
            success: true,
            data: identity,
            message: "Identity created successfully",
        });
    }

});

// update identity by infulencer id
const updateIdentity = Trycatch(async (req, res, next) => {
    const updatedIdentity = await Identiy.findOneAndUpdate(
        { influe_id: req.user.id },
        req.body,
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: updatedIdentity,
        message: "Identity updated successfully",
    });
});

// find by infulencer id
const getIdentity = Trycatch(async (req, res, next) => {

    var useId ;
    if(req.params.id){
        useId = req.params.id
    }else{
        useId = req.user.id
    }

    const identity = await Identiy.findOne({ influe_id: useId });
    res.status(200).json({
        success: true,
        data: identity,
        message: "Identity fetched successfully",
    });
});

// delete identity
const deleteIdentity = Trycatch(async (req, res, next) => {
    const identity = await Identiy.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        data: identity,
        message: "Identity deleted successfully",
    });
});

module.exports = {
    createIdentity,
    updateIdentity,
    getIdentity,
    deleteIdentity,
}