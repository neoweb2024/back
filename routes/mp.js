const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
const { AppointmentModel } = require("../models/appointment/appointmentModel");
const { Preference, MercadoPagoConfig, Payment, } = require("mercadopago");

const TOKEN = process?.env?.MPTOKEN ?? ""

// Agrega credenciales
const client = new MercadoPagoConfig({
  accessToken: TOKEN,
});

const payment = new Payment(client);

// POST
router.post("/crear-preferencia", async (req, res) => {
  try {

    const appo = {
      nombre : "nicoa" //meter datos del turno
    }

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
        success: "https://proyecto-neo.vercel.app/reserva-exitosa", 
        failure: "https://proyecto-neo.vercel.app/reserva-error",
      },
      auto_return: "approved",
      external_reference: appo,
      notification_url: "https://proyecto-neo-back-production.up.railway.app/mercadopago/webhook"
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    res.json({
      id: result.id,
    });
  } catch (error) {
    console.log(error);
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
      // console.log(result.external_reference, "soy el turno");

      if (result.status === "approved") {
        const appointmentPaid = result.external_reference //turno pagado
        //CREAR TURNO
      }
      return res.status(200);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;
