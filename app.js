if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const mongoose = require("mongoose");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const MONGO_URL = 'mongodb://127.0.0.1:27017/bookmenow';
// const dbUrl = process.env.ATLASDB_URL;
main()
    .then(() => {
        console.log("Connected Successfully");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// method that is used to create a new mongo store
// yoh jaile pani mathi halne kina bhane session ma sessionOptions pass bhako cha
// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto:{
//         secret: process.env.SECRET,
//     },
//     touchAfter: 24 * 3600,
// });

// store.on("error",()=>{
//     console.log("ERROR in MONGO SESSION STORE",err);
// });

const sessionOptions = ({
    // store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // A middleware that initalizes passport
app.use(passport.session()); // req lai thahos kun wala session ko part bhanera tei bhayera use garnu parcha
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// route bhanda aagadi nai session rah flash lignu parcha
app.use("/",userRouter);
app.use("/listing",listingsRouter);
app.use("/listing/:id/reviews",reviewsRouter);
app.use("/",bookingRouter);

// It is done if somebody gives random url
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

// custom error handler
app.use((err, req, res, next) => {
    let{status = 500,message = "Something went wrong"} = err;
    res.status(status).render("error.ejs",{message})
});
