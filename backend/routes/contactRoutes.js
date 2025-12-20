// routes/contactRoutes.js

const express = require("express");
const router = express.Router();

const { contactUs } = require("../controllers/ContactController");

router.post("/contact", contactUs);

module.exports = router;
