const express = require('express');
const addProduct = require('../controllers/products/addProduct');
const getProducts = require('../controllers/products/getProducts');
const deleteProduct = require('../controllers/products/deleteProduct');

const route = express.Router();


route.post('/', addProduct);
route.get('/', getProducts);
route.delete('/:_id', deleteProduct);


module.exports = route;
