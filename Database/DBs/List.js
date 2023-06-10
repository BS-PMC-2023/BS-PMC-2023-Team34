const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
  Id: Number,
  Category:String,
  Name: String,
  totalAmount: Number,
  availableAmount: Number,
});

const lists = mongoose.model("lists", ListSchema);
module.exports = { lists };
