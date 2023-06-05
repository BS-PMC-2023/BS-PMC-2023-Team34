const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  Id: Number,
  Name: String,
  totalAmount: Number,
  availableAmount: Number,
});

const lists = mongoose.model("lists", ListSchema);
module.exports = { lists };
