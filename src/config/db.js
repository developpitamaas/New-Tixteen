const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const connectDb = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI, {
    await mongoose.connect("mongodb+srv://sachinpitamaasweb:2U8iSnXE8YCrgo5p@cluster0.zj9x2jv.mongodb.net/tixteen_db?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("connected to Mongoose database.");
  } catch (error) {
    console.error("Unable to connect to MongoDB Database", error);
  }
};

// export database
module.exports = connectDb