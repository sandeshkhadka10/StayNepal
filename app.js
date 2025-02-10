const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");

const mongoose = require("mongoose");

const listing = require("./models/listing");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")); 

app.use(express.static(path.join(__dirname,"public")));

app.use(express.urlencoded({extended:true}));

app.use(methodOverride('_method'));

app.engine('ejs', ejsMate);

main()
    .then(() => {
        console.log("Connected Successfully");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/bookmenow');
}

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// app.get("/testListing",async(req,res)=>{
//     let sampleListing = new listing({
//         title: "My New Villa",
//         description: "Look the view",
//         price: 99,
//         location: "Bali",
//         country:"Indonesia"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successfull test");
// });

// Index Route
app.get("/listing",async(req,res)=>{
    let allListing = await listing.find();
    res.render("listings/index.ejs",{allListing});
});

// New Route
app.get("/listing/new",(req,res)=>{
    res.render("listings/new.ejs");
});

// Create Route
app.post("/listing",async(req,res)=>{
    const newListing = new listing(req.body.listing);
    // new listning(listing);
    await newListing.save();
    res.redirect("/listing");
});

// Edit Route
app.get("/listing/:id/edit",async(req,res)=>{
    let {id} = req.params;
    let editListing = await listing.findById(id);
    res.render("listings/edit.ejs",{editListing});
});

// Update Route
app.patch("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
});

// Delete Route
app.delete("/listing/:id",async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/listing");
});

// Show Route
app.get("/listing/:id",async(req,res)=>{
   let {id} = req.params;
   const Listing = await listing.findById(id);
   res.render("listings/show.ejs",{Listing});
});
