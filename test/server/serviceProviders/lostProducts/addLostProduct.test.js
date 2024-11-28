require('@dotenvx/dotenvx').config({path: '.env.test'});
const mocha = require('mocha');
const chai = require('chai');
const Product = require('../../../../server/models/product');
const createAgentAccount = require('../../../../server/serviceProviders/agents/createAgentAccount');
const Agent = require('../../../../server/models/agent');
const AgentAuth = require('../../../../server/models/agentAuth');
const addLostProduct = require('../../../../server/serviceProviders/lostProducts/addLostProduct');
const {describe, it} = mocha;

describe('addLostProduct', function(){
  
  it('it should add product', async function(){
    await Agent.deleteMany({});
    await AgentAuth.deleteMany({});
    await Product.deleteMany({});


    let newAgent = await createAgentAccount(undefined, {
      firstName: 'Lucas',
      lastName: 'Gomes',
      email: 'lucas.bsg@hotmail.com',
      password: 'Test145*'
    });

    let agentId = newAgent.agent._id;

    let title = 'Pink Samsung S9';
    let description = 'Pink Samsung S9 lost in the café';
    let newProduct = await addLostProduct(agentId, {
      title: title,
      description: description}
    );

    chai.assert.isOk(newProduct._id, 'it has been created');
    chai.expect(newProduct.tags).to.have.members(['pink', 'samsung', 's9', 'café']);
    chai.assert.equal(newProduct.title, title);
    chai.assert.equal(newProduct.description, description);
    chai.assert.equal(newProduct.registeredBy.toString(), agentId.toString());
    chai.assert.equal(newProduct.wasItFoundByOwner, false);
    
  })
})
