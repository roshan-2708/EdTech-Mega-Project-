
const express = require("express");
const router = express.Router();

const {
    capturePayment,
    verifyPayment,
    sendPaymentSuccessEmail,
} = require("../controllers/paymentController");

const { auth, isStudent } = require("../middleware/auth");

// router.get("/test", (req, res) => {
//     res.json({ success: true, message: "Payment route working" });
// });

router.post("/capture-payment", auth, isStudent, capturePayment);

router.post("/verify-payment", auth, isStudent, verifyPayment);
router.post(
    "/send-payment-success-email",
    auth,
    isStudent,
    sendPaymentSuccessEmail
);

module.exports = router;

