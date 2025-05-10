const mongoose = require('mongoose');

const totaluser = new mongoose.Schema({
  name: { type: String, required: true },
  GoogleID: { type: String, required: true },
  image: { type: String }, // URL or base64
});

const Totaluser = mongoose.model('Totaluser', totaluser);

module.exports = Totaluser;
