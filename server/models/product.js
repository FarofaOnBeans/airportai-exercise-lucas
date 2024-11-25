const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Product = new Schema(
  {
    title: {type: String, required: true, index: 1},
    description: {type: String, default: ''},
    // Admin User who registered the product
    registeredBy: {type: String, required: true, index: 1},
    registeredDateTime: {type: Date, default: Date.now, index: -1},
    wasItFoundByOwner: {type: Boolean, default: false, index: 1},
    dateTimeFoundByOnwer: {type: Date, default: null},
  }
);


module.exports = mongoose.model('product', Product);
