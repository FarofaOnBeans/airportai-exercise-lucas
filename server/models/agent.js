const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Agent = new Schema({
  email: {type: String, required: true, index: 1},
  firstName: {Type: String, required: true},
  lastName: {type: String}
}, {collection: 'Agents'});

module.exports = mongoose.model('Agent', Agent);

