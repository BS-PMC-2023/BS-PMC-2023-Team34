const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({

    Id:Number,
    Name: String,
    Amount:Number,
    Date:Date,

});
const lists = mongoose.model("lists", ListSchema);
module.exports = { lists };