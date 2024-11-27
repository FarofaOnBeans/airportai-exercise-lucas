const Agent = require('../../models/agent');
const Product = require('../../models/product');
const BusinessLogicError = require('../errors/BusinessLogicError');
const FieldRequiredError = require('../errors/FieldRequiredError');
const InvalidFieldError = require('../errors/InvalidFieldError');
const expectedTypes = require('../expectedTypes');
const keywordUtils = require('../../../utils/keywords-utils');

/**
 * @typedef LostProductInfo
 * @property {String} title
 * @property {String} description
*/

/**
 * 
 * @param {string} agentId 
 * @param {LostProductInfo} lostProductInfo 
 */
async function addLostProduct(agentId, lostProductInfo){
  let agent = Agent.findById(agentId);
  if (!agent) {
    throw new AgentAdminNotFound(agentId);
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

  let keywords = keywordUtils.getProductKeywordsFromDescription(lostProductInfo.description);
  let tags = keywords.map((e) => e.word);
  
  let newProduct = new Product({
    title: lostProductInfo.title,
    description: lostProductInfo.description,
    registeredBy: agentId,
    registeredDateTime: new Date(),
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
    tags: tags

  });

  let res = await newProduct.save();

  return res;
  

}

module.exports = {
  addLostProduct
}