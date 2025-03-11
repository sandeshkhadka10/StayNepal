const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const listing = require("../models/listing");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

// It is done for the server side validation
// const validateListing = (req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }

// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new",isLoggedIn(listingController.renderNewForm));

// Create Route
router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// Update Route
router.patch("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

// Show Route
router.get("/:id", wrapAsync(listingController.showListing));

module.exports = router;