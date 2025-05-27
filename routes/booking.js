const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateBooking } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");
const booking = require("../models/booking.js");

router.route("/listing/:id/book")
  .get(isLoggedIn,wrapAsync(bookingController.renderBookingForm))
  .post(isLoggedIn,validateBooking,wrapAsync(bookingController.bookingForm))


router.get("/listing/:id/bookinghistory",async (req,res)=>{
  let bookingHistory = await booking.find();
  res.render("booking/bookingHistory.ejs",{bookingHistory});
});

module.exports = router;