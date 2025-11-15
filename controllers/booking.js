const booking = require("../models/booking");
const listing = require("../models/listing");
const nodemailer = require("nodemailer");
// require('dotenv').config(); this is already done in app.js

module.exports.renderBookingForm = async (req, res) => {
    const listingId = req.params.id;
    const Listing = await listing.findById(listingId);
    res.render("booking/form.ejs", { Listing });
};

module.exports.bookingForm = async (req, res) => {
    const listingId = req.params.id;
    const Listing = await listing.findById(listingId).populate('owner');

    const roomNeeded = req.body.booking.roomneeded;

    // Date Validation
    const checkIn = new Date(req.body.booking.checkin);
    const checkOut = new Date(req.body.booking.checkout);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize

    if (checkIn < today) {
        req.flash("error", "Check-in date cannot be in the past.");
        return res.redirect(`/listing/${listingId}`);
    }

    if (checkOut < today) {
        req.flash("error", "Check-out date cannot be in the past.");
        return res.redirect(`/listing/${listingId}`);
    }

    if (checkOut <= checkIn) {
        req.flash("error", "Check-out date must be after the check-in date.");
        return res.redirect(`/listing/${listingId}`);
    }
    // End Date Validation

    // Room availability
    if (Listing.rooms >= roomNeeded) {

        const newBooking = new booking(req.body.booking);
        newBooking.listing = listingId;

        let savedBooking = await newBooking.save();

        Listing.rooms -= roomNeeded;
        await Listing.save();

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            await transporter.sendMail({
                from: '"StayNepal" <attkhadka551@gmail.com>',
                to: Listing.owner.email,
                subject: `New Booking for ${Listing.title}`,
                html: `
                    <h3>You have a new booking</h3>
                    <p><strong>Guest:</strong> ${newBooking.name}</p>
                    <p><strong>Email:</strong> ${newBooking.email}</p>
                    <p><strong>Contact No:</strong> ${newBooking.contact}</p>
                    <p><strong>No of Person:</strong> ${newBooking.peopleno}</p>
                    <p><strong>No of Room Needed:</strong> ${newBooking.roomneeded}</p>
                    <p><strong>Check-in Date:</strong> ${new Date(newBooking.checkin).toDateString()}</p>
                    <p><strong>Check-out Date:</strong> ${new Date(newBooking.checkout).toDateString()}</p>
                `
            });

            req.flash("success", "Booking confirmed! The owner has been notified");
            return res.redirect(`/listing/${listingId}`);

        } catch (err) {
            req.flash("error", "Something went wrong while processing your booking");
            return res.redirect(`/listing/${listingId}`);
        }

    } else {
        req.flash("error", `Only ${Listing.rooms} room(s) available. Cannot book ${roomNeeded} room(s).`);
        return res.redirect(`/listing/${listingId}`);
    }
};


module.exports.bookingHistory = async (req, res) => {
  let { id } = req.params;
  let bookingHistory = await booking.find({ listing: id });
  if (bookingHistory.length === 0) {
    req.flash("error", "No Booking History Exists.");
    return res.redirect(`/listing/${id}`);
  }
  res.render("booking/bookingHistory.ejs", { bookingHistory });
};