const mongoose = require('mongoose');


const mybillSchema = new mongoose.Schema({

    bill_id: { type: String,  },
    client_name: { type: String,  },
    address: { type: String,  },
    gst: { type: String,  },
    invoice_no: { type: String,  },
    contact_no: { type: String,  },
    status: { type: String,  },
    state_code: { type: String,  },
    bill_date: { type: Date,  },
    invoice_status: { type: String,  },
    tax_invoice_no: { type: String,  },
    report: { type: String,  },

}, { timestamps: true });

module.exports = mongoose.model('my_bill', mybillSchema)