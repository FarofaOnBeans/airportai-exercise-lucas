const BusinessLogicError = require('../../serviceProviders/errors/BusinessLogicError');
const getAgentFromHeader = require('../getAgentFromHeader');
const serviceDeleteLostProduct = require('../../serviceProviders/lostProducts/deleteLostProduct');

async function deleteProduct(req, res){
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
  let targetId = req.params._id;
  
  try {
    let deletedProduct = await serviceDeleteLostProduct(agent._id, targetId);
    res.json({
      result: deletedProduct
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

module.exports = deleteProduct;