var express = require('express');
var router = express.Router();
const { AvailabilityModel } = require('../models/availability/availabilityModel');
const { AppointmentModel } = require('../models/appointment/appointmentModel');

/* GET of availability */
router.get('/', async function (req, res, next) {
    try {
        let availability = await AvailabilityModel.findOne({})

        if (!availability) {
            const newDoc = new AvailabilityModel({
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
                bans: []
            });
            await newDoc.save();
            availability = newDoc
        }

        res.send(availability)

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: GET of availability");
    }
});


/* PUT of availability */
router.put('/', async function (req, res, next) {
    try {
        let availability = await AvailabilityModel.findOne({})

        if (!availability) {
            res.send("No availability")
        } else {
            await AvailabilityModel.updateOne({}, { $set: req.body });
            res.send("Availability updated successfully");
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: PUT of configuration");
    }
});

// GET of query of an appointment
router.get('/:date', async function (req, res, next) {
    try {
        const dateParam = req.params.date;
        const day = parseInt(dateParam.substring(0, 2), 10);
        const month = parseInt(dateParam.substring(2, 4), 10) - 1;
        const year = parseInt(dateParam.substring(4, 8), 10);

        const parsedDate = new Date(Date.UTC(year, month, day));

        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        const dayOfWeek = daysOfWeek[parsedDate.getUTCDay()];

        let availability = await AvailabilityModel.findOne({});

        if (!availability) {
            res.send("No availability")
        } else {
            const realMonth = `${month + 1}`.length > 1 ? `${month + 1}` : `0${month + 1}`
            const appointmentInThisDay = await AppointmentModel.find({
                date: `${day}/${realMonth}/${year}`
            });
            let unavailableSchedules = appointmentInThisDay.map((ap) => ap.hour)
            res.send({ date: `${day}/${realMonth}/${year}`, unavailableSchedules, allSchedules: availability[dayOfWeek] })
        }

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: GET of query of an appointment");
    }
});

module.exports = router;
