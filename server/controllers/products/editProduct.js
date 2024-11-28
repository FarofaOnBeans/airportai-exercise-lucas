const BusinessLogicError = require('../../serviceProviders/errors/BusinessLogicError');
const getAgentFromHeader = require('../getAgentFromHeader');
const serviceEditLostProduct = require('../../serviceProviders/lostProducts/editLostProduct');

async function editProduct(req, res){
  let agent = getAgentFromHeader(req);
  if (!agent){
    res.status(401).json({
      status: 401,
      error: {
        message: 'Please login as an agent to create products'
      }
    });
    return;
  };
  let docToEdit = {...req.body};
  if (req.params._id) {
    docToEdit._id = req.params._id;
  }
  try {
    let product = await serviceEditLostProduct(agent._id, docToEdit);
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

module.exports = editProduct;