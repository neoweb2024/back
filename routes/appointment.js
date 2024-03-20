var express = require("express");
const dayjs = require("dayjs");
const { AppointmentModel } = require("../models/appointment/appointmentModel");
var router = express.Router();

/*GET of appointments */
router.get("/:fecha", async function (req, res, next) {
  try {
    const fechaParam = req.params.fecha;
    let userAppointments;

    if (fechaParam.length === 8) {
      // Si la longitud es 8, asumimos que es día, mes y año
      const day = parseInt(fechaParam.substring(0, 2), 10);
      const month = parseInt(fechaParam.substring(2, 4), 10) - 1;
      const year = parseInt(fechaParam.substring(4, 8), 10);
      const realMonth =
        `${month + 1}`.length > 1 ? `${month + 1}` : `0${month + 1}`;

      userAppointments = await AppointmentModel.find({
        date: `${day}/${realMonth}/${year}`,
      });
    } else if (fechaParam.length === 6) {
      // Si la longitud es 6, asumimos que es mes y año
      const month = parseInt(fechaParam.substring(0, 2), 10);
      const year = parseInt(fechaParam.substring(2, 6), 10);

      userAppointments = await AppointmentModel.find({
        date: {
          $regex: `${month}/${year}`,
        },
      });
    } else {
      return res.status(400).json({
        error: "Formato de fecha inválido. Esperado: DDMMYYYY o MMYYYY",
      });
    }

    res.json(userAppointments);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error: GET de turnos de usuario");
  }
});

/*GET appo by prefe*/
router.get("/getByPreference/:id", async function (req, res, next) {
  const preferenceId = req.params.id;
  try {
    const appointmentFound = await AppointmentModel.findOne({
      preferenceId: preferenceId,
    });

    if (appointmentFound) {
      res.json(appointmentFound);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error: GET of an appointment");
  }
});

/* POST of user appointments */
router.post("/getByDni", async function (req, res, next) {
  const { dni } = req.body;

  try {
    const userAppointments = await AppointmentModel.find({ dni: dni });

    if (userAppointments.length > 0) {
      res.json(userAppointments);
    } else {
      res.status(404).json({ error: "User has no appointments" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error: GET of user appointments");
  }
});

/* POST of appointment */
router.post("/create", async function (req, res, next) {
  try {
    const lastMonth = dayjs().subtract(1, 'month').format('MM/YYYY');

    await AppointmentModel.deleteMany({
      date: {
        $regex: `^\\d{2}/.*${lastMonth}`
      }
    });

    const existingAppointment = await AppointmentModel.findOne({
      date: req.body.date,
      hour: req.body.hour,
      canceled: false,
    });

    if (existingAppointment) {
      return res.send(existingAppointment);
    } else {
      const newDoc = new AppointmentModel(req.body);
      await newDoc.save();

      res.send(newDoc);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error: POST of appointment");
  }
});

/* PUT (cancellation) of appointment */
router.put("/cancel", async function (req, res, next) {
  const { email, date, hour, canceled } = req.body;

  try {
    const query = { email: email, date: date, hour: hour };
    const newData = { canceled: canceled };

    const updatedAppointment = await AppointmentModel.findOneAndUpdate(
      query,
      newData,
      {
        new: true,
      }
    );

    if (updatedAppointment) {
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error: PUT (cancel) of appointment");
  }
});

/* PUT (update) of appointment */
router.put("/update", async function (req, res, next) {
  const { email, date, hour, newData } = req.body;

  try {
    const query = { email: email, date: date, hour: hour };

    const updatedAppointment = await AppointmentModel.findOneAndUpdate(
      query,
      newData,
      {
        new: true,
      }
    );

    if (updatedAppointment) {
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error: PUT (update) of appointment");
  }
});

router.delete("/delete/:preferenceId", async function (req, res, next) {
  const preferenceId = req.params.preferenceId;

  try {
    const deletedAppointment = await AppointmentModel.findOneAndDelete({
      preferenceId: preferenceId,
    });

    if (deletedAppointment) {
      res.json(deletedAppointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send("Internal Server Error: DELETE (delete) of appointment");
  }
});

module.exports = router;
