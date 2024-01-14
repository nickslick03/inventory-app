const mongoose = require('mongoose');

const { Schema } = mongoose;

const Category = new Schema({
    name: { type: String, required: true },
    description: String,

});

Category.virtual('URL').get(function () {
    return `/category/${this._id}`;
});

module.exports = mongoose.model('Category', Category);