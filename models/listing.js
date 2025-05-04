const mongoose = require("mongoose");
const {Schema} = mongoose;
const review = require("./review.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        url: String,
        filename: String
    },   
    price: {
        type: Number
    },
    location: {
        type: String,
    },
    country: {
        type: String
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category:{
        type: String,
        enum: ["Airport","Budget","Bus-Park","Camping","City-Area","Domes","Eco-Friendly","Farms","Home-Stay","Lakes","Luxury","Mountains","River"],
    },
    contact:{
        type:Number,
        match: /^(98|97)[0-9]{8}$/
    }
});

//this is done to delete the reviews from the database when listing is deleted
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;