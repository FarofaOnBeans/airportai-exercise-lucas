const express = require('express');
const addProduct = require('../controllers/products/addProduct');

const route = express.Router();


route.post('/', addProduct);


module.exports = route;
