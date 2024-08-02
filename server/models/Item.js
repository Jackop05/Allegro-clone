const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true
  },
  quantityAvailable: {
    type: Number,
    required: true
  },
  boughtNumber: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: ''
  },
  hashtags: [{
    type: String,
    default: ''
  }],
  image: {
    type: String,
    default: ''
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
