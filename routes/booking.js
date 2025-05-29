const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateBooking } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");
const booking = require("../models/booking.js");

router.route("/listing/:id/book")
  .get(isLoggedIn, wrapAsync(bookingController.renderBookingForm))
  .post(isLoggedIn, validateBooking, wrapAsync(bookingController.bookingForm))


router.get("/listing/:id/bookinghistory", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let bookingHistory = await booking.find({ listing: id });
  if (bookingHistory.length === 0) {
    req.flash("error", "No Booking History Exists.");
    return res.redirect(`/listing/${id}`);
  }
  res.flash("error", "Failed to load the booking history");
  res.render("booking/bookingHistory.ejs", { bookingHistory });
}));

module.exports = router;