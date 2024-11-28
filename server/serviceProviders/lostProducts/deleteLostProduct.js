const Agent = require('../../models/agent');
const Product = require('../../models/product');
const BusinessLogicError = require('../errors/BusinessLogicError');
const FieldRequiredError = require('../errors/FieldRequiredError');
const InvalidFieldError = require('../errors/InvalidFieldError');
const expectedTypes = require('../expectedTypes');
const keywordUtils = require('../../../utils/keywords-utils');
const mongoose = require('mongoose');
const _ = require('lodash');
/**
 * @typedef LostProductInfo
 * @property {String} _id
 * @property {String} title
 * @property {String} description
 * @property {String[]} tags
 * @property {String} wasItFoundByOwner
*/

/**
 * 
 * @param {string} agentId 
 * @param {LostProductInfo} lostProductInfo 
 */
async function deleteLostProduct(agentId, lostProductInfo){
  let agent = Agent.findById(new mongoose.Types.ObjectId(agentId));
  if (!agent) {
    throw new AgentAdminNotFound(agentId);
  }

  if (!(lostProductInfo._id)) {
    throw new FieldRequiredError('_id');
  }
  if (typeof lostProductInfo._id !== 'string') {
    throw new InvalidFieldError('_id', {
      receivedValue: lostProductInfo._id,
      expectedType: expectedTypes.STRING
    });
  }

  let documentId = new mongoose.Types.ObjectId(lostProductInfo._id);

  let product = await Product.findById(documentId);

  if (!product) {
    throw new BusinessLogicError(`Product with Id ${lostProductInfo._id} was not found`, {httpStatus: 404});
  }

  let productClone = product.toJSON();

  await Product.deleteOne({_id: documentId});
  return productClone;
}

module.exports = deleteLostProduct;
