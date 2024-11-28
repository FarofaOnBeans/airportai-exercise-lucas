const BusinessLogicError = require('../../serviceProviders/errors/BusinessLogicError');
const getAgentFromHeader = require('../getAgentFromHeader');
const serviceSearchLostProducts = require('../../serviceProviders/lostProducts/searchLostProducts');

async function getProducts(req, res){
  try {
    let query = {};
    if (typeof req.query === 'object') {
      query = req.query;
    }
    let products = await serviceSearchLostProducts(query);
    res.json({
      result: products
    });
  } catch (e) {
    console.error(e);
    if (e instanceof BusinessLogicError) {
      res.status(e.httpStatus).json({
        status: e.httpStatus,
        error: {
          message: e.message
        }
      })
    } else {
      res.status(500).json({
        status: 500,
        error: {
          message: 'An unknown error has occurred'
        }
      })
    }
  }

}

module.exports = getProducts;