const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const listing = require("../models/listing");
const review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuther} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// Post Reviews Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuther,reviewController.deleteReview);

module.exports = router;