const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const hostSche = new Schema({
  imgHost: String,
  nameHost: String,
  phoneNumber: String,
  mailHost: String,
});

const overviewSche = new Schema({
  bedroom: String,
  bathroom: String,
  floor: String,
  area: Number,
  yearBuilt: String,
});



const New = new Schema({
  motelId: String,
  img: Array,
  kind: String,
  title: String,
  slug: String,
  gender: String,
  priceNumber: Number,
  price: String,
  idCity: String,
  idDis: String,
  idWard: String,
  street: String,
  address: String,
  location: String,
  description: String,
  kindOfNews: String,
  features: Array,
  overview: overviewSche,
  host: hostSche

});

module.exports = mongoose.model('New', New);