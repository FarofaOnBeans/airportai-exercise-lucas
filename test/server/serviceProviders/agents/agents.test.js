require('@dotenvx/dotenvx').config({path: '.env.test'});
const mocha = require('mocha');
const chai = require('chai');
const Agent = require('../../../../server/models/agent');
const AgentAuth = require('../../../../server/models/agentAuth');
const mongoose = require('mongoose');
require('../../../../server/setup/mongoose');

const createAgentAccount = require('../../../../server/serviceProviders/agents/createAgentAccount');
const BusinessLogicError = require('../../../../server/serviceProviders/errors/BusinessLogicError');


const {describe, it} = mocha;


describe('Agents\'s Service Provider', function(){
  describe('CreateAgentAccount', function(){
    it('As a guest, it SHOULD create an agent when the app does not have any agents.', async function(){

      await Agent.deleteMany({});
      await AgentAuth.deleteMany({});

      let res = await createAgentAccount(undefined, {
        firstName: 'Lucas',
        lastName: 'Gomes',
        email: 'lucas.bsg@hotmail.com',
        password: 'Test145*'
      });

      console.log(res);

      chai.assert.containsAllKeys(res, ['agent', 'agentAuth']);
      chai.assert.isOk(mongoose.Types.ObjectId.isValid(res.agent._id));
      chai.assert.isOk(mongoose.Types.ObjectId.isValid(res.agentAuth._id));
      chai.assert.strictEqual(res.agentAuth.agent.toString(), res.agent._id.toString(), 'Agent has an assigned Password');
      
      
    });

    it('As a guest, it SHOULD NOT create an Agent when the app does have an agent already', async function(){

      //await Agent.deleteMany({});
      //await AgentAuth.deleteMany({});

      try {
        let res = await createAgentAccount(undefined, {
          firstName: 'Lucas',
          lastName: 'Gomes',
          email: 'lucas.bsg@hotmail.com',
          password: 'Test145*'
        }); 
      } catch (e) {
        if (e instanceof BusinessLogicError) {
          chai.assert.isOk((e.httpStatus === 401), 'it did not allow to create an account');
          return;
        }
        throw e;
      }

      chai.assert.fail();
      
      
    });

  })
})
