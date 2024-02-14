const express = require('express');
const router = express.Router();
const { Preference, MercadoPagoConfig } = require('mercadopago');

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'TEST-8633523865276392-020907-91a34f6b10384b3ec555d52713c48e7b-168165628' });

// POST 
router.post('/crear-preferencia', async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.price),
          currency_id:"ARS"
        }
      ],
      "back_urls": {
        "success": "https://www.tu-sitio/success", //cuando haya deploy poner el endpoint del create appo
        "failure": "http://www.tu-sitio/failure",
        "pending": "http://www.tu-sitio/pending"
    },
    "auto_return": "approved",
    }

    const preference = new Preference(client)
    const result = await preference.create({body})
  
    res.json({
      id: result.id
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:"error al crear la preferencia"
    })
  }
})

module.exports = router;
