// paymentController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const PaymentModel = require("../models/paymentModel");

class PaymentController {
  constructor() {
    this.paymentModel = new PaymentModel();
  }

  async processPayment(req, res) {
    const { amount, id, plan_id, months, trainer_id } = req.body;
    const user_id = req.user.user.Id;

    try {
      // Check if the user has an active subscription
      const activeSubscriptions = await this.paymentModel.checkActiveSubscription(
        user_id
      );

      if (activeSubscriptions.length > 0) {
        // User has an active subscription, handle accordingly
        return res.status(201).json({
          message: "User already has an active subscription",
          success: false,
        });
      }

      // Proceed with the payment process as before
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description: "Spatula company",
        payment_method: id,
        confirm: true,
        return_url: "http://localhost:3000/",
      });

      if (payment.status === "succeeded") {
        const subscribed_at = new Date();
        const end_at = new Date();
        end_at.setMonth(end_at.getMonth() + months);

        const addedSubscriber = await this.paymentModel.addSubscriber(
          user_id,
          plan_id,
          subscribed_at,
          end_at,
          trainer_id
        );

        console.log("User added to subscribers table:", addedSubscriber);

        res.json({
          message: "Payment successful",
          success: true,
        });
      } else {
        console.log("Payment failed");
        res.json({
          message: "Payment failed",
          success: false,
        });
      }
    } catch (error) {
      console.error("Error", error);
      res.json({
        message: "Payment failed",
        success: false,
      });
    }
  }
}

module.exports = PaymentController;
