const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    name: String,
    phone: String,
    address: String,
    email: String,
    city: String,
    state: String,
    mapPoint: String
});

module.exports = ContactSchema;
