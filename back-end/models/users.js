const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    profileImage: { type: String, required: false },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    friendRequest: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  },
  {
    timestamps: true,
    
  }
);


const user = mongoose.model("user", userSchema);
module.exports = user;
