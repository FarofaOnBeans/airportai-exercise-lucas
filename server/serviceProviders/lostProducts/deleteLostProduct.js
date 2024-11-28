const Agent = require('../../models/agent');
const Product = require('../../models/product');
const BusinessLogicError = require('../errors/BusinessLogicError');
const FieldRequiredError = require('../errors/FieldRequiredError');
const mongoose = require('mongoose');
const _ = require('lodash');

/**
 * 
 * @param {string} agentId 
 * @param {string} docId 
 */
async function deleteLostProduct(agentId, docId){
  let agent = Agent.findById(new mongoose.Types.ObjectId(agentId));
  if (!agent) {
    throw new AgentAdminNotFound(agentId);
  }

  if (!(docId)) {
    throw new FieldRequiredError('_id');
  }

  let documentId = new mongoose.Types.ObjectId(docId);

  let product = await Product.findById(documentId);

  if (!product) {
    throw new BusinessLogicError(`Product with Id ${docId} was not found`, {httpStatus: 404});
  }

  let productClone = product.toJSON();

  await Product.deleteOne({_id: documentId});
  return productClone;
}

module.exports = deleteLostProduct;
