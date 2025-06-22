const mongoose = require("mongoose");
const {Schema} = mongoose;
const review = require("./review.js");
const { required } = require("joi");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },   
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review",
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
        enum: ["Airport","Budget","Bus-Park","Camping","City-Area","Domes","Eco-Friendly","Farms","Home-Stay","Lakes","Luxury","Mountains","River-Side"],
        required: true
    },
    contact:{
        type:Number,
        match: /^(98|97)[0-9]{8}$/,
        required: true
    },
    rooms:{
        type:Number,
        required: true
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