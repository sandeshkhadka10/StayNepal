const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email:{
        type: String,
        required: true,
        unique: true
    },
    googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null for users not using Google
  }
});
// it automatically adds username, hashing, salting and hash passport 
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);

module.exports = User;
