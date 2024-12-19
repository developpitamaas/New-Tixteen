const ClientData = require("../../../models/client/clientregistration");
const Trycatch = require("../../../middleware/trycatch");

//  get client registration
const GetClientData = Trycatch(async (req, res) => {
    const clientData = await ClientData.find();
    
    res.status(200).json({
        success: true,
        count: clientData.length,
        clientData
    })
})

// create client registration
const CreateClientData = Trycatch(async (req, res) => {
    const clientData = await ClientData.create(req.body);
    res.status(200).json({
        success: true,
        clientData
    })
})


// update client registration
const UpdateClientData = Trycatch(async (req, res) => {
    const clientData = await ClientData.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        clientData
    })
})


// delete client registration
const DeleteClientData = Trycatch(async (req, res) => {
    const clientData = await ClientData.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        clientData
    })
})

// get single client registration
const GetSingleClientData = Trycatch(async (req, res) => {
    const clientData = await ClientData.findById(req.params.id);
    res.status(200).json({
        success: true,
        clientData
    })
})

module.exports = {
    GetClientData,
    CreateClientData,
    UpdateClientData,
    DeleteClientData,
    GetSingleClientData
}