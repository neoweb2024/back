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
    const frontUrl = req.headers.host;
    const protocol = req.protocol;
    const backendUrl = req.get('host');

    const successUrl = `${protocol}://${frontUrl}/reserva-exitosa`;
    const failureUrl = `${protocol}://${frontUrl}/reserva-error`;

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
      external_reference: req.body.appointment,
      notification_url: `${protocol}://${backendUrl}/mercadopago/webhook`
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
  const protocol = req.protocol;
  const backendUrl = req.get('host');

  let paymentQ = req.query;
  try {

    if (paymentQ.type === "payment") {
      const result = await payment.get({
        id: paymentQ["data.id"],
      });

      if (result.status === "approved") {
        const appointmentPaid = result.external_reference
        await fetch(`${protocol}://${backendUrl}/appointment/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentPaid),
        });
      }
      return res.status(200);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});


module.exports = router;
