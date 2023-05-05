const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({

    Name: String,
    Amonut:Number,

});
const List = mongoose.model("Lists", ListSchema);
module.exports = { List };