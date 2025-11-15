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
        type:String,
        required: true
    },
    peopleno:{
        type:Number,
        required:true
    },
    roomneeded:{
        type:Number,
        required:true
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