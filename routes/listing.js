const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const listing = require("../models/listing");

// It is done for the server side validation
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    let allListing = await listing.find();
    res.render("listings/index.ejs", { allListing });
}));

// New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create Route
router.post("/", validateListing, wrapAsync(async (req,res,next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));

// Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
}));

// Update Route
router.patch("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
}));

// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { Listing });
}));

module.exports = router;