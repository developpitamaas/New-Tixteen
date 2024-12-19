const mongoose = require('mongoose');


const billItemSchema = new mongoose.Schema({

    Invoice_no: { type: String, required: true },
    product: { type: String, required: true },
    hsn: { type: String, required: true },
    qty: { type: String, required: true },
    rate: { type: String, required: true },
    taxable: { type: String, required: true },
    cgst_Rate: { type: String, required: true },
    cgst_Amount: { type: String, required: true },
    sgst_Rate: { type: String, required: true },
    sgst_Amount: { type: String, required: true },
    igst_Rate: { type: String, required: true },
    igst_Amount: { type: String, required: true },
    tax_invoice_no: { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('bill_items', billItemSchema);