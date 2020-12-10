const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tenant = new Schema({
    name: String,
    age: String,
    address: String,
    phone: String,
    card_id: String,
    room_number: String,
    electricity: Number,
    water: Number,
    money:Number,
    date: String,
    fromM: String,
    toM: String,
    email: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Tenant', Tenant);
