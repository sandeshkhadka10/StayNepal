const listing = require("./models/listing");

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

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let Listing = await listing.findById(id);
    if(!Listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        res.redirect(`/listing/${id}`);
    }
}