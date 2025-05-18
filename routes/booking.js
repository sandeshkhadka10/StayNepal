const express = require("express");
const router = express.Router();
const booking = require("../models/booking");
const listing = require("../models/listing");

router.get("/book",(req,res)=>{
    // console.log("it is working");
    res.render("booking/form.ejs");
});

module.exports = router;