const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  name: { type: String, required: true },
  GoogleID: { type: String, required: true },
  image: { type: String }, // URL or base64
});

const messageSchema = new mongoose.Schema({
  from: { type: String, required: true }, // GoogleID
  to: { type: String, required: true },   // GoogleID
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  delivered: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
});

const onlineUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  GoogleID: { type: String, required: true },
});

const chatDataSchema = new mongoose.Schema(
  {
    myGoogleID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String }, // Google profile picture

    friends: [friendSchema],
    messages: [messageSchema],
    onlineUsers: [onlineUserSchema],
  },
  {
    timestamps: true,
  }
);


const Chatdata = mongoose.model('Chatdata', chatDataSchema);

module.exports = Chatdata;
