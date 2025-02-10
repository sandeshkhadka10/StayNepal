const express = require("express");
const app = express();

const mongoose = require("mongoose");

const listing = require("../models/listing");

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

app.get("/testListing",async(req,res)=>{
    let sampleListing = new listing({
        title: "My New Villa",
        description: "Look the view",
        price: 99,
        location: "Bali",
        country:"Indonesia"
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("Successfull test");
});