const listing = require("../models/listing");

module.exports.indexRoute = (async (req, res) => {
    let allListing = await listing.find();
    res.render("listings/index.ejs", { allListing });
});

module.exports.renderNewForm = (req, res) => {
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
}; 

module.exports.createListing = (async (req,res,next) => {
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
});

module.exports.renderEditForm = (async (req, res) => {
    let { id } = req.params;
    let editListing = await listing.findById(id);
    if(!editListing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { editListing });
}); 

module.exports.updateListing = (async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
});

module.exports.deleteListing = (async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
});

module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!Listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", {Listing});
});