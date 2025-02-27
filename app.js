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

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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

// app.get("/", (req, res) => {
//     res.send("Hi, I am root");
// });




app.use("/listing",listings);
app.use("/listing/:id/review",reviews);


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







// It is done if somebody gives random url
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

// custom error handler
app.use((err, req, res, next) => {
    let{status = 500,message = "Something went wrong"} = err;
    res.status(status).render("error.ejs",{message})
});
