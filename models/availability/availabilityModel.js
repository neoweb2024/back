const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AvailabilitySchema = new Schema({
    monday: [String],
    tuesday: [String],
    wednesday: [String],
    thursday: [String],
    friday: [String],
    saturday: [String],
    sunday: [String],
    bans: [String]
});

const AvailabilityModel = mongoose.model("AvailabilitySchema", AvailabilitySchema);

module.exports = { AvailabilityModel };
