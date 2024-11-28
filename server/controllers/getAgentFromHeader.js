
const sessionTokens = require('../serviceProviders/auth/sessionTokens');


function getAgentFromSessiontoken (req) {
  let authorizationHeader = req.header('Authorization');
  if (authorizationHeader) {
    let splitRes = authorizationHeader.split('Bearer ');
    if (splitRes.length === 2) {
      let decodedToken = sessionTokens.validateSessionToken(splitRes[1]);
      return decodedToken.agent;
    }
  }
  return null;
}

module.exports = getAgentFromSessiontoken;