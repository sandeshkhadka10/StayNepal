const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {
  saveRedirectUrl,
  validateSignup,
  validateLogin,
  validateForgetPassword,
  validateResetPassword,
} = require("../middleware");
const userController = require("../controllers/user");

// for doing signup
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(validateSignup, wrapAsync(userController.createSignUp));

// for doing login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    validateLogin,
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.createLogin
  );

// for doing logout
router.get("/logout", userController.logout);

// for forgetting the password
router
  .route("/forgetPassword")
  .get(userController.renderForgetPasswordForm)
  .post(validateForgetPassword, wrapAsync(userController.forgetPassword));

// for verfication of code
router.get("/verifyCode",(req,res)=>{
  if(!req.session.resetEmail){
    res.flash("error","Session expired. Try again");
    return res.redirect("/forgetPassword");
  }
  res.render("users/verifyCode.ejs");
});

router.post("/verifyCode",(req,res)=>{
  const {code} = req.body;

  if(req.session.resetCode == code){
    req.session.codeVerified = true;
    return res.redirect("/resetPassword");
  }

  req.flash("error","Invalid Code. Try Again");
  return res.redirect("/verifyCode");
});
 
// for reseting the password
router
  .route("/resetPassword")
  .get(userController.renderResetPasswordForm)
  .post(validateResetPassword, wrapAsync(userController.resetPassword));

// for google authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  userController.googleCallBack
);



module.exports = router;
