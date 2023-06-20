const express = require("express");
const app = express();
const { resolve } = require("path");
const bodyParser = require("body-parser");
// Replace if using a different env file or config
require("dotenv").config();
app.use(bodyParser.json());
const stripe = require("stripe")(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: "2022-08-01",
});
const cors = require("cors");
app.use(cors({
  credentials:true
}));

app.get("/config", (req, res) => {
  res.json({
    publishableKey: `${process.env.STRIPE_PUBLISHABLE_KEY}`,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  let {price} = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "INR",
      amount: price*100,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.json({
      clientSecret: `${paymentIntent.client_secret}`,
    });
  } catch (e) {
    console.log(e.message)
    return res.json({
      error: {
        message: e,
      },
    });
  }
});

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
