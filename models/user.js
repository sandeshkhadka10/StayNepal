const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  }
});

// this automatically handles the username, hashing and salting of password 
userSchema.plugin(passportLocalMongoose,{
  usernameFiled: "email", // this tells it to treat email as the username
  usernameUnique: "false" // prevents it from creating a unique index on "username" 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
