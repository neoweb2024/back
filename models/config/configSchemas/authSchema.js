const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
    domain:String,
    clientId: String
});

module.exports = AuthSchema