const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({

    Name: String,
    Amount:Number,
    Date:Date,

});
const List = mongoose.model("Lists", ListSchema);
module.exports = { List };