const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuededSchema = new Schema({
    date: String,
    hour: String,
});

const QuededModel = mongoose.model("QuededSchema", QuededSchema);

module.exports = { QuededModel };
