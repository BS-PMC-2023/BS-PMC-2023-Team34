const mongoose = require("mongoose");

const regSchema = new mongoose.Schema({
  product_id: Number,
  product_name: String,
  problem:String,
});
const Report = mongoose.model("reports", regSchema);
module.exports = { Report };
