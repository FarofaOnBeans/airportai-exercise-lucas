

const loginAsAgent = require('../../serviceProviders/agents/loginAsAgent');
const BusinessLogicError = require('../../serviceProviders/errors/BusinessLogicError');
async function loginAgent(req, res){
  
  try {
    let loggedInData = await loginAsAgent(req.body.email, req.body.password);

    res.json({result: {agent: loggedInData.agent, token: loggedInData.token}});
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

module.exports = loginAgent;