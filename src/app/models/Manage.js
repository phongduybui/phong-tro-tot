const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Manage = new Schema({
    name_inn: {type: String, required: true},
    name_owner : String,
    address : String,
    phone: String,
    room_number: String,
    room_empty: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Manage', Manage);
