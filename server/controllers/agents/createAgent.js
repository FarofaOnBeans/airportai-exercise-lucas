

const createAgentAccount = require('../../serviceProviders/agents/createAgentAccount');
const BusinessLogicError = require('../../serviceProviders/errors/BusinessLogicError');
const getAgentFromHeader = require('../getAgentFromHeader');
async function createAgent(req, res){

  let agent = getAgentFromHeader(req);
  let agentId = (!!agent) ? agent._id : undefined;
  try {
    let agentCreated = await createAgentAccount(agentId, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });

    res.json({result: agentCreated.agent});
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

module.exports = createAgent;