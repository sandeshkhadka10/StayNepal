module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
    // console.log(req);
    // console.log(req.path,"..",req.originalUrl);
    if(!req.isAuthenticated()){
        // login garepachi kaam garne specific path ma jaos bhanera
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}