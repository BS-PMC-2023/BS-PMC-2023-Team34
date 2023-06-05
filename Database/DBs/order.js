const mongoose = require("mongoose");

const regSchema = new mongoose.Schema({
  product_id: Number,
  product_name: String,
  startDate: Date,
  endDate: Date,
  user_id: Number,
  user_name: String,
  user_roll: String,
  status: String,
  amount: Number,
});
const Order = mongoose.model("order", regSchema);
module.exports = { Order };
