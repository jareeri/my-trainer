const express = require("express");
const verifyToken = require("../middleware/authenticateToken");
const PaymentController = require("../controllers/paymentController");

const router = express.Router();
const paymentController = new PaymentController();

router.post(
  "/payment",
  verifyToken.authenticateToken,
  async (req, res) => {
    paymentController.processPayment(req, res);
  }
);

module.exports = router;
