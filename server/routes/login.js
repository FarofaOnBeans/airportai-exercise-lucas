const express = require('express');
const loginAgent = require('../controllers/agents/loginAgent');

const route = express.Router();

route.post('/', loginAgent);

module.exports = route;
