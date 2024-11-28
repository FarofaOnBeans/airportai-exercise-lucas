const express = require('express');
const createAgent = require('../controllers/agents/createAgent');

const route = express.Router();


route.post('/', createAgent);


module.exports = route;
