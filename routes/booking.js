const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateBooking } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

router.route("/listing/:id/book")
  .get(isLoggedIn,wrapAsync(bookingController.renderBookingForm))
  .post(isLoggedIn,validateBooking,wrapAsync(bookingController.bookingForm))


router.get("/listing/:id/bookinghistory",(req,res)=>{
  res.send("For showing booking history");
});

module.exports = router;