/**
 * App routes definitions.
 */
'use strict';

let express = require('express');

let signupRoute = require('./signup');
let loginRoute = require('./login');
let productsRoute = require('./products');

let router = express.Router();


// To confirm setup only.
router.get('/', (req, res) => res.send('Hello world!'));

router.use('/signup', signupRoute);
router.use('/login', loginRoute);
router.use('/products', productsRoute);

module.exports = router;
