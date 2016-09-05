'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  name: String,
  imgUrl: String,
  pictures: [{ type: String, unique: true }],
  active: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);
