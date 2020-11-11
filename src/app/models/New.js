const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const New = new Schema({
  price: { type: String, default: ''},
  title: String,
  location: String,
  detail: String
});

module.exports = mongoose.model('New', New);