const BusinessLogicError = require('./BusinessLogicError');

class AgentAdminNotFound extends BusinessLogicError {
  constructor(agentId){
    let message = 'Agent Admin Not Found.';
    if (typeof agentId === 'string') {
      message = `Agent Admin with ID "${agentId}" was not found.`;
    }
    super(message, {httpStatus: 401});
  }
}

module.exports = AgentAdminNotFound;