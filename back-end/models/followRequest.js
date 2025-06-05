const mongoose = require("mongoose");


const followRequestSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status:{
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})

const FollowRequest = mongoose.model("followRequest", followRequestSchema);
module.exports = FollowRequest;