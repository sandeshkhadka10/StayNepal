const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.createSignUp = (async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to StayNepal");
            res.redirect("/listing");
        });
    } catch (e) {
        req.flash("error","Email is already in use");
        res.redirect("/signup");
    }
});

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.createLogin =  async(req, res) => {
    req.flash("success","Welcome back to StayNepal");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logout successfully");
        res.redirect("/listing");
    });
};

module.exports.renderForgetPasswordForm = (req,res)=>{
    res.render("users/forgetPassword.ejs");
};

module.exports.forgetPassword = (async(req,res)=>{
        let {email} = req.body;
        let user = await User.findOne({email});
        if(!user){
            req.flash("error","Email is not registered");
            return res.redirect("/forgetPassword");
        }
        req.session.resetEmail = email;
        res.redirect("/resetPassword");
});

module.exports.renderResetPasswordForm = (req,res)=>{
    if(!req.session.resetEmail){
        req.flash("error","Session expired. Try again.");
        return res.redirect("/forgetPassword");
    }
    res.render("users/resetPassword.ejs");
};

module.exports.resetPassword = (async(req,res)=>{
    let {newPassword} = req.body;
    let email = req.session.resetEmail;

    let user = await User.findOne({email});
    if(!user){
        req.flash("error","User not found");
        return res.redirect("/forgetPassword");
    }

    await user.setPassword(newPassword);
    await user.save();

    delete req.session.resetEmail;

    req.flash("success","Password updated successfully! Please log in.");
    res.redirect("/login");
});

module.exports.googleCallBack = (req, res) => {
    // Successful auth, redirect somewhere
    res.redirect("/listing");
  }
