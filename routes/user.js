const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl,validateSignup, validateLogin, validateForgetPassword} = require("../middleware");
const userController = require("../controllers/user");

// for doing signup
router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(validateSignup,wrapAsync(userController.createSignUp));

// for doing login
router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        validateLogin,
        saveRedirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.createLogin
    );

// for doing logout
router.get("/logout", userController.logout);

// for forgetting and resetting the password
router.route("/forgetPassword")
  .get(userController.renderForgetPasswordForm)
  .post(validateForgetPassword,wrapAsync(userController.forgetPassword));

router.route("/resetPassword")
   .get(userController.renderResetPasswordForm)
   .post(wrapAsync(userController.resetPassword));

module.exports = router;