const MYBILL = require("../../models/invoice/mybill");
const BillItem = require("../../models/invoice/billitem");
const Trycatch = require("../../middleware/trycatch.js");

const getMyBill = Trycatch(async (req, res) => {
  const invoice_statusData = req.query.invoice_status;
  const mybill = await (await MYBILL.find({ invoice_status: invoice_statusData })).reverse();
  res.status(200).json({
    success: true,
    count: mybill.length,
    mybill,
  });
});

const getAllBillItem = Trycatch(async (req, res) => {
  const mybill = await (await BillItem.find()).reverse();
  res.status(200).json({
    success: true,
    count: mybill.length,
    mybill,
  });
});

// create mybill
const createMyBill = Trycatch(async (req, res) => {
  const mybill = await MYBILL.create(req.body);
  res.status(200).json({
    success: true,
    mybill,
  });
});

// create bill items
const createBillItems = Trycatch(async (req, res) => {
  console.log(req.body);
  const billitems = await BillItem.create(req.body);
  res.status(200).json({
    success: true,
    billitems,
  });
});

// update mybill
const updateMyBill = async (req, res) => {
  try {
    const mybill = await MYBILL.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      mybill,
    });
  } catch (error) {
    console.error("Error updating the bill:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update invoice",
    });
  }
};

const updateBillItems = async (req, res) => {
  const items = req.body;

  try {
    for (const newItem of items) {
      const existingItem = await BillItem.findOne({
        Invoice_no: newItem.Invoice_no,
        _id: newItem._id,
      });

      if (existingItem) {
        const updateFields = {
          hsn: newItem.hsn,
          qty: newItem.qty,
          rate: newItem.rate,
          taxable: newItem.taxable,
          cgst_Rate: newItem.cgst_Rate,
          cgst_Amount: newItem.cgst_Amount,
          sgst_Rate: newItem.sgst_Rate,
          sgst_Amount: newItem.sgst_Amount,
          igst_Rate: newItem.igst_Rate,
          igst_Amount: newItem.igst_Amount,
          tax_invoice_no: newItem.tax_invoice_no,
          product: newItem.product,
        };

        await BillItem.findByIdAndUpdate(existingItem._id, updateFields);
      } else {

        await BillItem.create(newItem);
      }
    }

    res.status(200).json({ message: "Bill items updated successfully." });
  } catch (err) {
    console.error("Error updating bill items:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const updateBillItemsss = async (req, res) => {
  try {
    const updatesData = req.body;

    if (!Array.isArray(updatesData)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data format. Expected an array.",
      });
    }

    const updatedItems = await Promise.all(
      updatesData.map(async (update) => {
        // Use Invoice_no and product as the unique identifiers to find the document
        const item = await BillItem.findOneAndUpdate(
          { Invoice_no: update.Invoice_no, product: update.product },
          update,
          {
            new: true, // Return the updated document
            upsert: true, // Create a new document if it doesn't exist
            runValidators: true, // Run validation on the update
          }
        );

        if (!item) {
          console.error(`Failed to update item: ${JSON.stringify(update)}`);
        }

        return item;
      })
    );

    res.status(200).json({
      success: true,
      billitems: updatedItems,
    });
  } catch (error) {
    console.error("Error updating bill items:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// delete mybill
const deleteMyBill = Trycatch(async (req, res) => {
  const mybill = await MYBILL.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    mybill,
  });
});

// delete bill items
const deleteBillItems = Trycatch(async (req, res) => {
  const billitems = await BillItem.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    billitems,
  });
});

// get single mybill
const getSingleMyBill = Trycatch(async (req, res) => {
  const mybill = await MYBILL.findById(req.params.id);
  if (!mybill) {
    throw new Error("No mybill found");
  }
  const mybillwithproduct = await BillItem.find({
    Invoice_no: mybill.invoice_no,
  });
  res.status(200).json({
    success: true,
    message: "data found",
    mybill,
    mybillwithproduct,
  });
});

const getBillItems = Trycatch(async (req, res) => {
  const mybill = await BillItem.find({ Invoice_no: req.params.id });
  if (!mybill) {
    throw new Error("No mybill found");
  }
  res.status(200).json({
    success: true,
    mybill,
  });
});

module.exports = {
  getMyBill,
  createBillItems,
  createMyBill,
  updateMyBill,
  deleteMyBill,
  getSingleMyBill,
  getAllBillItem,
  updateBillItems,
  deleteBillItems,
  getBillItems,
};
