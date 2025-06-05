const mongoose = require("mongoose");
const {Schema} = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    sparse: true // allow multiple nulls
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  username: String
});


// it automatically adds username, hashing, salting and hash passport 
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);

module.exports = User;
