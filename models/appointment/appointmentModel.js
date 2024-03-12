const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const parentSchema = new Schema({
    name: String,
    lastName: String,
    dni: String,
    contactPhone: String,
    contactEmail: String
})

const AppointmentSchema = new Schema({
    patientType: String,
    type: String,
    name: String,
    lastName: String,
    age: Number,
    dni: String,
    reasonForConsultation: String,
    socialWork: String,
    parentOrGuardianDetails: parentSchema,
    contactPhone: String,
    contactEmail: String,
    date: String,
    hour: String,
    canceled: Boolean,
    preferenceId: String
});

const AppointmentModel = mongoose.model("AppointmentSchema", AppointmentSchema);

module.exports = { AppointmentModel };
