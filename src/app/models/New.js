const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const New = new Schema({
  mapId: String,
  map: String,
  img: String,
  price: { type: String, default: ''},
  title: String,
  location: String,
  area: String,
  phoneNumber: String
});

module.exports = mongoose.model('New', New);