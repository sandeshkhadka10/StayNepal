const listing = require("../models/listing");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });
const booking = require("../models/booking");

module.exports.indexRoute = (async (req, res) => {
  let { category } = req.query;
  let { location } = req.query;

    let filter = {};

    // If a category is selected filter it otherwise show all listing
    if(category){
        filter.category = category;
    }
    
    // It is for providing the specific location based on the user input
    if(location){
        filter.location = location;
    }

    let allListing = await listing.find(filter);
    if (category && allListing.length === 0) {
        req.flash("error", `Soon the hotel will be added in these "${category}" category.`);
        return res.redirect("/listing");
    }
    if (location && allListing.length === 0) {
        req.flash("error", `Enter valid location to find the hotel in "${location}".`);
        return res.redirect("/listing");
    }
    res.render("listings/index.ejs", { allListing });
});

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}; 


module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 2,
    })


  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url,"..",filename);

  const newListing = new listing(req.body.listing);
  // console.log(newListing.category); it is done to check whether the category is being passed or not

  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created!");
  res.redirect("/listing");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let editListing = await listing.findById(id);
  if (!editListing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listing");
  }
  let originalImageUrl = editListing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { editListing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let Listing = await listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    Listing.image = { url, filename };
    await Listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listing");
};


module.exports.showListing = (async (req, res) => {
    let { id } = req.params;
    const Listing = await listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!Listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs", {Listing});
});

