const mongoose = require("mongoose");
const {Schema} = mongoose;

const bookingSchema = new Schema({
    listing:{
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    name:{
        type:String
    },
    email:{
        type:String
    },
    contact:{
        type:Number,
        match: /^(98|97)[0-9]{8}$/
    },
    checkin:{
        type:Date
    },
    checkout:{
        type:Date
    }
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;