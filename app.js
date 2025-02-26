const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

const mongoose = require("mongoose");
const listing = require("./models/listing");
const review = require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

main()
    .then(() => {
        console.log("Connected Successfully");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookmenow');
}

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

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
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new listing({
//         title: "My New Villa",
//         description: "Look the view",
//         price: 99,
//         location: "Bali",
//         country:"Indonesia"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successfull test");
// });

// Index Route
app.get("/listing", wrapAsync(async (req, res) => {
    let allListing = await listing.find();
    res.render("listings/index.ejs", { allListing });
}));

// New Route
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Create Route
app.post("/listing", validateListing, wrapAsync(async (req,res,next) => {
    const newListing = new listing(req.body.listing);
    await newListing.save();
    res.redirect("/listing");
}));

// Edit Route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    res.render("listings/edit.ejs", { editListing });
}));

// Update Route
app.patch("/listing/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`);
}));

// Delete Route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

// Post Reviews Route
app.post("/listing/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let Listing = await listing.findById(id);
    let newReview = new review(req.body.review);
    Listing.reviews.push(newReview); //yoh reviews bhaneko chai array ho jun listingSchema bitra cha
    await newReview.save();
    await Listing.save();
    console.log("New Review Saved");
    // res.send("New Review Saved");
    res.redirect(`/listing/${id}`);
}));

// Delete Review Route
app.delete("/listing/:id/reviews/:reviewId",async(req,res)=>{
    let {id} = req.params;
    let {reviewId} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews: reviewId}});
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
});

// Show Route
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { Listing });
}));

// It is done if somebody gives random url
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

// custom error handler
app.use((err, req, res, next) => {
    let{status = 500,message = "Something went wrong"} = err;
    res.status(status).render("error.ejs",{message})
});
