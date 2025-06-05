const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "post", // Links comment to a specific post
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user", // Author of the comment
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // For replies
      default: null, // null = top-level comment
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt
);

module.exports = mongoose.model("Comment", commentSchema);
