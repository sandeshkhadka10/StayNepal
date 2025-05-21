const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

router.route("/listing/:id/book")
  .get(isLoggedIn,wrapAsync(bookingController.renderBookingForm))
  .post(isLoggedIn,wrapAsync(bookingController.bookingForm))

module.exports = router;