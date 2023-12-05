const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", true);
const dbconnect = () => {
  const dbname="chatty"
  try {
    const conn = mongoose.connect(process.env.MONGOURL,{dbname});
  
    console.log("Mongo connected");
  } catch (err) {
    // throw new Error(err);
    console.log("Mongo error", err);
  }
};

module.exports = dbconnect;
