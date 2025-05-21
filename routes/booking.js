const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

router.route("/listing/:id/book")
  .get(isLoggedIn,wrapAsync(bookingController.renderBookingForm))
  .post(isLoggedIn,wrapAsync(bookingController.bookingForm))

// router.get("/listing/:id/book", isLoggedIn, wrapAsync, async (req, res) => {
//     const listingId = req.params.id;
//     const Listing = await listing.findById(listingId);
//     res.render("booking/form.ejs", { Listing });
// });

// router.post("/listing/:id/book", isLoggedIn, wrapAsync(async (req, res) => {
//     // find the listing
//     const listingId = req.params.id;
//     const Listing = await listing.findById(listingId).populate('owner');

//     // creating a new booking using form data
//     const newBooking = new booking(req.body.booking);
//     newBooking.listing = listingId; // manually link to listing
//     let savedBooking = await newBooking.save();

//     // sending email to owner
//     try {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASSWORD
//             }
//         });
//         await transporter.sendMail({
//             from: '"StayNepal" <attkhadka551@gmail.com>',
//             to: Listing.owner.email,
//             subject: `New Booking for ${Listing.title}`,
//             html: `
//                <h3>You have a new booking</h3>
//                <p><strong>Guest: </strong> ${newBooking.name}</p>
//                <p><strong>Email: </strong> ${newBooking.email}</p>
//                <p><strong>Contact No: </strong> ${newBooking.contact}</p>
//                <p><strong>Check-in Date: </strong> ${new Date(newBooking.checkin).toDateString()}</p>
//                <p><strong>Check-out Date: </strong> ${new Date(newBooking.checkout).toDateString()}</p>
//                `
//         });

//         req.flash("success", "Booking confirmed! The owner has been notified");
//         res.redirect(`/listing/${listingId}`);

//     } catch (err) {
//         req.flash("error", "Something went wrong while processing your booking");
//         res.redirect(`/listing/${req.params.id}`);
//     }
// }));

module.exports = router;