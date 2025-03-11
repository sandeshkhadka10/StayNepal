const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js");
const listing = require("../models/listing");
const review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuther} = require("../middleware.js");

// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(",");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }

// Post Reviews Route
router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;

    // console.log(req.params.id);

    let Listing = await listing.findById(id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;

    Listing.reviews.push(newReview); //yoh reviews bhaneko chai array ho jun listingSchema bitra cha

    await newReview.save();
    await Listing.save();

    req.flash("success","New Review Created!");
    // console.log("New Review Saved");
    // res.send("New Review Saved");
    res.redirect(`/listing/${id}`);
}));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuther,async(req,res)=>{
    let {id} = req.params;
    let {reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
});

module.exports = router;