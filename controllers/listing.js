const listing = require("../models/listing");

module.exports.index = (async (req, res) => {
    let allListing = await listing.find();
    res.render("listings/index.ejs", { allListing });
});