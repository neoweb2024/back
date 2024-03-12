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

// POST
router.post("/crear-preferencia", async (req, res) => {
  try {

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
      "external_reference": "RiseUP",
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


module.exports = router;
