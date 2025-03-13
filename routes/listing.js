const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage});

router.route("/")
    .get(wrapAsync(listingController.indexRoute))
    // .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));
    .post(upload.single('listing[image]'),(req,res)=>{
        res.send(req.file);
    })

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Index Route
// router.get("/", wrapAsync(listingController.indexRoute));

// Create Route
// router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Update Route
// router.patch("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// Show Route
// router.get("/:id", wrapAsync(listingController.showListing));

module.exports = router;