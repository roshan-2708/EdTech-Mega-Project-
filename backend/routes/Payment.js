const express = require("express");
const router = express.Router();

const {
    capturePayment,
    paymentWebhook,
    verifySignature
} = require("../controllers/paymentController");

const { auth, isStudent } = require("../middleware/auth");

// Create Razorpay Order
router.post("/capture-payment", auth, isStudent, capturePayment);

// Razorpay Webhook (RAW body required)
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    paymentWebhook
);

// Signature Verification
router.post("/verify-signature", verifySignature);

module.exports = router;
