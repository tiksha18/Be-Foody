const express = require("express");
const { protectRoute } = require("../Controller/authController");
const { createPaymentSession, checkoutComplete } = require("../Controller/bookingController");


const bookingRouter = express.Router();

bookingRouter.post("/createPaymentSession", protectRoute, createPaymentSession);
bookingRouter.post("/checkoutComplete", checkoutComplete);

module.exports = bookingRouter;