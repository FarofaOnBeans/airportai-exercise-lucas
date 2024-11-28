const Agent = require('../../models/agent');
const AgentAuth = require('../../models/agentAuth');
const getPublicAppSetupInfo = require('../appSetup/getPublicAppSetupInfo');
const BusinessLogicError = require('../errors/BusinessLogicError');
const FieldRequiredError = require('../errors/FieldRequiredError');
const InvalidFieldError = require('../errors/InvalidFieldError');
const PasswordError = require('../errors/PasswordError');
const expectedTypes = require('../expectedTypes');
const agentPasswordManager = require('./agentPasswordManager');
const mongoose = require('mongoose');

/**
 * @param {string} actionAgentId Id of the agent that is executing an action
 * @param {Object} info 
 * @param {string} info.firstName first name of the new Agent
 * @param {string} info.lastName last name of the new Agent
 * @param {string} info.email email of the agent
 * @param {string} info.password password of the agent
 */
async function createAgentAccount(actionAgentId, info){
  if (!info) {
    throw new Error("Info not provided.");
  }
  if (!actionAgentId) {
    let appSetup = await getPublicAppSetupInfo();
    if (appSetup.isAgentSetup) {
      throw new BusinessLogicError('Not authorized. You need to be an agent in order to create another account.', {httpStatus: 403});
    }
  } else {
    let agent = await Agent.findById(new mongoose.Types.ObjectId(actionAgentId));
    if (!agent) {
      throw new AgentAdminNotFound();
    }
  }

  if (!(info.firstName)) {
    throw new FieldRequiredError('firstName');
  }
  if (typeof info.firstName !== 'string') {
    throw new InvalidFieldError('firstName', {
      receivedValue: info.firstName,
      expectedType: expectedTypes.STRING
    });
  }

  if (info.lastName) {
    if (typeof info.lastName !== 'string') {
      throw new InvalidFieldError('lastName', {
        receivedValue: info.lastName,
        expectedType: expectedTypes.STRING
      });
    }
  }


  if (!(info.email)) {
    throw new FieldRequiredError('email');
  }
  if (typeof info.email !== 'string') {
    throw new InvalidFieldError('email', {
      receivedValue: info.email,
      expectedType: expectedTypes.STRING
    });
  }

  let emailRegx = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gi;

  if(!(emailRegx.test(info.email))) {
    throw new InvalidFieldError('email', {
      receivedValue: info.email,
      expectedType: expectedTypes.STRING
    });
  }

  let existentAgentWithEmail = await Agent.findOne({email: info.email});
  if (existentAgentWithEmail) {
    throw new BusinessLogicError('An account was already registered with that e-mail.');
  }

  if (!(info.password)) {
    throw new FieldRequiredError('password');
  }
  if (typeof info.password !== 'string') {
    throw new InvalidFieldError('password', {
      receivedValue: info.password,
      expectedType: expectedTypes.STRING
    });
  }

  if(!(agentPasswordManager.isPasswordGood(info.password))) {
    throw new PasswordError('Password is weak. It needs to have at least one Uppercase, one special character, and have 8 or more characters.');
  };

  let hashedPassword = await agentPasswordManager.hashPassword(info.password);
  
  

  let newAgent = new Agent({
    email: info.email,
    firstName: info.firstName || '',
    lastName: info.lastName
  });

  await newAgent.save();

  let newAgentAuth = new AgentAuth({
    agent: newAgent._id,
    passwd: hashedPassword
  });

  await newAgentAuth.save();

  
  // I would do this with transactions, but it would require doing configuration in the database.(Replica Sets)
  /*
  let session = await mongoose.startSession();
  await session.withTransaction(async () => {
    console.log('before saving newAgent', newAgent);
    await newAgent.save({session});
    console.log('after saving newAgent', newAgent);


    newAgentAuth = new AgentAuth({
      agent: newAgentRes._id,
      passwd: hashedPassword
    });

    await newAgentAuth.save({session: session});
    
  })
  */

  return {
    agent: newAgent,
    agentAuth: newAgentAuth,
  }

}

module.exports = createAgentAccount;

