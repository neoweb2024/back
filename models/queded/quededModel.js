const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuededSchema = new Schema({
    date: String,
    hour: String,
    expiration: Date
});

const QuededModel = mongoose.model("QuededSchema", QuededSchema);

module.exports = { QuededModel };
