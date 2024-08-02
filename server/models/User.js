const mongoose = require('mongoose');
const { Schema } = mongoose;



const cartItemSchema = new Schema({
    itemId: {
      type: String, 
      required: true,
    },
    itemName: {
      type: String, 
      required: true,
    },
    itemDescription: {
      type: String, 
      required: true,
    },
    numberOfItems: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default: ''
    }
  }, { _id: false });

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: [{

  }],
  liked: [{
    type: String,
    default: ''
  }],
  myItemsList: [{
    type: String,
    default: ''
  }],
  categoriesPoints: [{
    type: Number,
    default: ''
  }],
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;