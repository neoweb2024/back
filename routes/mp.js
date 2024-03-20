const express = require("express");
const router = express.Router();
const { Preference, MercadoPagoConfig, Payment, } = require("mercadopago");
import { AppointmentModel } from "../models/appointment/appointmentModel";
import { QuededModel } from "../models/queded/quededModel";

const TOKEN = process?.env?.MPTOKEN ?? ""

// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: TOKEN,
});

const payment = new Payment(client);

function transformarObjeto(objeto) {
  const nuevoObjeto = {};

  for (let clave in objeto) {
    if (objeto.hasOwnProperty(clave)) {
      let nuevaClave = clave.replace(/_([a-z])/g, function (match, letra) {
        return letra.toUpperCase();
      });

      if (typeof objeto[clave] === 'object' && objeto[clave] !== null && !Array.isArray(objeto[clave])) {
        nuevoObjeto[nuevaClave] = transformarObjeto(objeto[clave]);
      } else {
        nuevoObjeto[nuevaClave] = objeto[clave];
      }
    }
  }

  return nuevoObjeto;
}


// POST
router.post("/crear-preferencia", async (req, res) => {
  try {

    const successUrl = `https://front-sable-one.vercel.app/reserva-exitosa`;
    const failureUrl = `https://front-sable-one.vercel.app/reserva-error`;

    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
      },
      auto_return: "approved",
      metadata: req.body.appointment,
      notification_url: `https://back-delta-seven.vercel.app/mercadopago/webhook`
    };

    const isQueded = QuededModel.findOne({
      date: req.body.appointment.date,
      hour: req.body.appointment.hour,
    })

    if (isQueded) return res.send({ error: "Turno en cola" })
    else {
      const newDoc = new QuededModel({
        date: req.body.appointment.date,
        hour: req.body.appointment.hour,
      });
      await newDoc.save();
    }

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

router.post("/webhook", async (req, res) => {
  let paymentQ = req.query;
  try {
    if (paymentQ.type === "payment") {
      const result = await payment.get({
        id: paymentQ["data.id"],
      });
      const existingAppointment = await AppointmentModel.findOne({
        date: result.metadata.date,
        hour: result.metadata.hour,
        canceled: false,
      });
      if (result.status === "approved" && !existingAppointment) {
        const newDoc = new AppointmentModel(transformarObjeto(result.metadata));
        await newDoc.save();
        await QuededModel.deleteOne({
          date: result.metadata.date,
          hour: result.metadata.hour
        })
      }
      return res.status(200);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;
