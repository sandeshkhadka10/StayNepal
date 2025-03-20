const listing = require("../models/listing");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });


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
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    })
    .send()

    // console.log(response.body.features[0].geometry);
    // res.send("done");
    
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url,"..",filename);

    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);

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
    let originalImageUrl = editListing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");

    res.render("listings/edit.ejs", { editListing, originalImageUrl });
}); 

module.exports.updateListing = (async (req, res) => {
    let { id } = req.params;
    let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = {url,filename};
    await Listing.save();
    }

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