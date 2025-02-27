const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const listing = require("../models/listing");
const review = require("../models/review.js");

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Post Reviews Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let Listing = await listing.findById(id);
    let newReview = new review(req.body.review);
    Listing.reviews.push(newReview); //yoh reviews bhaneko chai array ho jun listingSchema bitra cha
    await newReview.save();
    await Listing.save();
    // console.log("New Review Saved");
    // res.send("New Review Saved");
    res.redirect(`/listing/${id}`);
}));

// Delete Review Route
router.delete("/",async(req,res)=>{
    let {id} = req.params;
    let {reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
});

module.exports = router;