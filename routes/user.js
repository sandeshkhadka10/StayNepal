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

// for password-reset

// router.get("/forgetPassword",(req,res)=>{
//     res.render("users/forgetPassword.ejs");
// });

// router.post("/forgetPassword",wrapAsync(async(req,res)=>{
//         let {email} = req.body;
//         let user = await User.findOne({email});
//         if(!user){
//             req.flash("error","Email is not registered");
//             return res.redirect("/forgetPassword");
//         }
//         req.session.resetEmail = email;
//         res.redirect("/resetPassword");
// }));

// router.get("/resetPassword",(req,res)=>{
//     if(!req.session.resetEmail){
//         req.flash("error","Session expired. Try again.");
//         return res.redirect("/forgetPassword");
//     }
//     res.render("users/resetPassword.ejs");
// });

// router.post("/resetPassword",wrapAsync(async(req,res)=>{
//     let {newPassword} = req.body;
//     let email = req.session.resetEmail;

//     let user = await User.findOne({email});
//     if(!user){
//         req.flash("error","User not found");
//         return res.redirect("/forgetPassword");
//     }

//     await user.setPassword(newPassword);
//     await user.save();

//     delete req.session.resetEmail;

//     req.flash("success","Password updated successfully! Please log in.");
//     res.redirect("/login");
// }));

router.route("/forgetPassword")
  .get(userController.renderForgetPasswordForm)
  .post(wrapAsync(userController.forgetPassword));

router.route("/resetPassword")
   .get(userController.renderResetPasswordForm)
   .post(wrapAsync(userController.resetPassword));

module.exports = router;