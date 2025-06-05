// backend/models/Conversation.js
const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // references your User model
    required: true,
  }]
}, { timestamps: true }); // keeps track of creation and update time

module.exports = mongoose.model('Conversation', conversationSchema);
