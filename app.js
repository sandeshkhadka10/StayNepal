const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema} = require("./schema.js");
// const {reviewSchema} = require("./schema.js");
const mongoose = require("mongoose");
// const listing = require("./models/listing");
// const review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

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

const sessionOptions = ({
    secret : "sandeshkhadka",
    resave : false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
});

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});
 
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// route bhanda aagadi nai session rah flash lignu parcha
app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews);

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
