const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
    imgUrl: String,
    title: String,
    content: String
});

module.exports = NewsSchema