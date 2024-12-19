const Industry = require("../../models/management/Industry");
const Trycatch = require("../../middleware/trycatch");

const createIndustries = Trycatch(async (req, res) => {
  const industries = await Industry.create(req.body);
  res.status(200).json({
    success: true,
    data: industries,
    message: "Industries created successfully",
  });
});

const updateIndustries = Trycatch(async (req, res) => {
  const industries = await Industry.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: industries,
    message: "Industries updated successfully",
  });
});

const deleteIndustries = Trycatch(async (req, res) => {
  const industries = await Industry.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    data: industries,
    message: "Industries deleted successfully",
  });
});

const getIndustriesById = Trycatch(async (req, res) => {
  const industries = await Industry.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: industries,
    message: "Industries fetched successfully",
  });
});

// const getAllIndustries = Trycatch(async (req, res) => {
//   const { name } = req.body;
//   if (!name) {
//     const industries = await Industry.find();
//     res.status(200).json({
//       success: true,
//       data: industries,
//       length: industries.length,
//       message: "Industries fetched successfully",
//     });
//   }
//   const industries = await Industry.find({ name });
//   res.status(200).json({
//     success: true,
//     data: industries,
//     length: industries.length,
//     message: "Industries fetched successfully",
//   });
// });
const getAllIndustries = Trycatch(async (req, res) => {
  const { name } = req.body;

  // Check if 'name' is provided or not
  let industries;
  if (name) {
    // If 'name' is provided, fetch industries based on that
    industries = await Industry.find({ name });
  } else {
    // If 'name' is not provided, fetch all industries
    industries = await Industry.find();
  }

  // Send response once, after fetching the industries
  res.status(200).json({
    success: true,
    data: industries,
    length: industries.length,
    message: "Industries fetched successfully",
  });
});

// const getAllIndustries = Trycatch(async (req, res) => {
//     const { name } = req.body;
  
//     let query = {};
//     if (name) {
//       query.name = name;
//     }
  
//     // Fetch industries based on query
//     const industries = await Industry.find(query);
  
//     // Remove duplicates based on the 'name' field
//     const uniqueIndustries = industries.reduce((acc, industry) => {
//       if (!acc.some(item => item.name === industry.name)) {
//         acc.push(industry);
//       }
//       return acc;
//     }, []);
  
//     res.status(200).json({
//       success: true,
//       data: uniqueIndustries,
//       length: uniqueIndustries.length,
//       message: "Industries fetched successfully",
//     });
//   });
  

module.exports = {
  getAllIndustries,
  getIndustriesById,
  createIndustries,
  updateIndustries,
  deleteIndustries,
};
