const mongoose = require("mongoose");
const {Schema} = mongoose;

const bookingSchema = new Schema({
    listing:{
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    contact:{
        type:Number,
        match: /^(98|97)[0-9]{8}$/,
        required: true
    },
    checkin:{
        type:Date,
        required: true
    },
    checkout:{
        type:Date,
        required: true
    }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;