const listing = require("../models/listing");
const review = require("../models/review");

module.exports.createReview = (async(req,res)=>{
    let {id} = req.params;

    let Listing = await listing.findById(id);
    let newReview = new review(req.body.review);
    newReview.author = req.user._id;

    Listing.reviews.push(newReview); //yoh reviews bhaneko chai array ho jun listingSchema bitra cha

    await newReview.save();
    await Listing.save();

    req.flash("success","New Review Created!");
    res.redirect(`/listing/${id}`);
});

module.exports.deleteReview = async(req,res)=>{
    let {id} = req.params;
    let {reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`);
};