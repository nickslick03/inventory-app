const mongoose = require('mongoose');

const { Schema } = mongoose;

const Item = new Schema({
    category: { type: mongoose.Types.ObjectId, },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
});

Item.virtual('url').get(function () {
    return `/item/${this._id}`;
});

module.exports = mongoose.model('Item', Item);