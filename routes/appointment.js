var express = require('express');
const dayjs = require('dayjs');
const { AppointmentModel } = require('../models/appointment/appointmentModel');
var router = express.Router();

/* POST of user appointments */
router.post('/getByEmail', async function (req, res, next) {
    const { email } = req.body;

    try {
        const userAppointments = await AppointmentModel.find({ email: email });

        if (userAppointments.length > 0) {
            res.json(userAppointments,);
        } else {
            res.status(404).json({ error: 'User has no appointments' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error: GET of user appointments');
    }
});

/* POST of appointment */
router.post('/create', async function (req, res, next) {
    try {
        await AppointmentModel.deleteMany({ date: { $lt: dayjs().format('DD/MM/YYYY') } });
        const newDoc = new AppointmentModel(req.body);
        await newDoc.save();

        res.send(newDoc);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error: POST of appointment");
    }
});

/* PUT (cancellation) of appointment */
router.put('/cancel', async function (req, res, next) {
    const { email, date, hour, canceled } = req.body;

    try {
        const query = { email: email, date: date, hour: hour };
        const newData = { canceled: canceled };

        const updatedAppointment = await AppointmentModel.findOneAndUpdate(query, newData, {
            new: true
        });

        if (updatedAppointment) {
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error: PUT (cancel) of appointment');
    }
});

/* PUT (update) of appointment */
router.put('/update', async function (req, res, next) {
    const { email, date, hour, newData } = req.body;

    try {
        const query = { email: email, date: date, hour: hour };

        const updatedAppointment = await AppointmentModel.findOneAndUpdate(query, newData, {
            new: true
        });

        if (updatedAppointment) {
            res.json(updatedAppointment);
        } else {
            res.status(404).json({ error: 'Appointment not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error: PUT (update) of appointment');
    }
});

module.exports = router;
