const Agent = require('../../models/agent');
const Product = require('../../models/product');
const BusinessLogicError = require('../errors/BusinessLogicError');
const FieldRequiredError = require('../errors/FieldRequiredError');
const InvalidFieldError = require('../errors/InvalidFieldError');
const expectedTypes = require('../expectedTypes');
const keywordUtils = require('../../../utils/keywords-utils');
const _ = require('lodash');
const mongoose = require('mongoose');

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
async function editLostProduct(agentId, lostProductInfo){
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
  
  if (!(lostProductInfo.title)) {
    throw new FieldRequiredError('title');
  }
  if (typeof lostProductInfo.title !== 'string') {
    throw new InvalidFieldError('title', {
      receivedValue: lostProductInfo.title,
      expectedType: expectedTypes.STRING
    });
  }

  if (!(lostProductInfo.description)) {
    throw new FieldRequiredError('description');
  }
  if (typeof lostProductInfo.description !== 'string') {
    throw new InvalidFieldError('description', {
      receivedValue: lostProductInfo.description,
      expectedType: expectedTypes.STRING
    });
  }


  let tags = lostProductInfo.tags;

  if (!tags) {
    let keywordsDescription = keywordUtils.getProductKeywordsFromDescription(lostProductInfo.description);
    let keywordsTitle = keywordUtils.getProductKeywordsFromDescription(lostProductInfo.title);

    let keywords = keywordsDescription.concat(keywordsTitle);
    tags = _.uniq(keywords.map((e) => e.word.toLowerCase()));
  }
  
  let product = await Product.findById(new mongoose.Types.ObjectId(lostProductInfo._id));

  if (!product) {
    throw new BusinessLogicError(`Product with Id ${lostProductInfo._id} not found`, {httpStatus: 404});
  }

  if (lostProductInfo.wasItFoundByOwner === true && product.wasItFoundByOwner === false) {
    product.dateTimeFoundByOnwer = new Date();
  }
  if (lostProductInfo.wasItFoundByOwner === false && product.wasItFoundByOwner === true) {
    product.dateTimeFoundByOnwer = null;
  }

  product.title = lostProductInfo.title;
  product.description = lostProductInfo.description;
  product.tags = tags;
  product.wasItFoundByOwner = lostProductInfo.wasItFoundByOwner;

  await product.save();

  return product;
  

}

module.exports = editLostProduct;
