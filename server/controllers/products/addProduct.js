const BusinessLogicError = require('../../serviceProviders/errors/BusinessLogicError');
const getAgentFromHeader = require('../getAgentFromHeader');
const serviceAddLostProduct = require('../../serviceProviders/lostProducts/addLostProduct');

async function addProduct(req, res){
  let agent = getAgentFromHeader(req);
  if (!agent){
    res.status(401).json({
      status: 401,
      error: {
        message: 'Please login as an agent to create products'
      }
    });
    return;
  }
  try {
    let product = await serviceAddLostProduct(agent._id, req.body);
    res.json({
      result: product
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

module.exports = addProduct;