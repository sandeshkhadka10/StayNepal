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
router.get("/new", isLoggedIn,(req, res) => {
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
});

// Create Route
router.post("/", isLoggedIn,validateListing, wrapAsync(async (req,res,next) => {
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
}));

// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    if(!editListing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { editListing });
}));

// Update Route
router.patch("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    // let Listing = await listing.findById(id);
    // if(!Listing.owner.equals(res.locals.currUser.id)){
    //     req.flash("error","You don't have permission to edit");
    //     return res.redirect(`/listing/${id}`);
    // }
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
}));

// Delete Route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
}));

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!Listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    // console.log(Listing);
    res.render("listings/show.ejs", {Listing});
}));

module.exports = router;