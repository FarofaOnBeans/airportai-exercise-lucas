const Agent = require('../../models/agent');
const AgentAuth = require('../../models/agentAuth');
const BusinessLogicError = require('../errors/BusinessLogicError');
const bcrypt = require('bcrypt');
const sessionTokens = require('../auth/sessionTokens');

async function loginAsAgent(email, password){
  let agent = await Agent.findOne({email: email});

  if (!agent) {
    throw new BusinessLogicError('An account with that email was not found', {httpStatus: 401});
  }
  let agentAuth = await AgentAuth.findOne({agent: agent._id});

  if (!agentAuth) {
    throw new BusinessLogicError('An unexpteded error has occurred', {httpStatus: 500});
  }

  const match = await bcrypt.compare(password, agentAuth.passwd);  
  if (!match) {
    throw new BusinessLogicError('The password does not match with the account you\'re trying to login', {httpStatus: 401});
  }

  let token = sessionTokens.generateSessionToken(agent);

  return {
    agent,
    agentAuth,
    token
  }


}

module.exports = loginAsAgent;