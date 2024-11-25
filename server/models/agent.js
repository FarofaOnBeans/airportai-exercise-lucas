const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Agent = new Schema({
  email: {type: String, required: true, index: 1},
  firstName: {Type: String, required: true},
  lastName: {type: String}
});

module.exports = mongoose.model('agent', Agent);

