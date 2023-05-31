const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({

    Id:Number,
    Name: String,
    Available:{type:Boolean,default:true},
    startDate:Date,
    endDate:Date,
    user_id:Number,
    user_name:String,
});
const lists = mongoose.model("lists", ListSchema);
module.exports = { lists };