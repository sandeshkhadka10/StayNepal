const mongoose = require("mongoose");
const {Schema} = mongoose;

const bookingSchema = new Schema({
    listing:{
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    }
});