const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.createSignUp));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.createLogin
    );

// rendering signup form
// router.get("/signup", userController.renderSignUpForm);

// inserting data in signup form
// router.post("/signup", wrapAsync(userController.createSignUp));

// rendering login form
// router.get("/login", userController.renderLoginForm);

// inserting data in login form
// router.post(
//     "/login", saveRedirectUrl,
//     passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
//     userController.createLogin
// );

// for doing logout
router.get("/logout", userController.logout);

// for forget password
router.get("/forgetPassword",(req,res)=>{
    // console.log("it is running");
    res.render("users/forgetPassword.ejs");
});

module.exports = router;