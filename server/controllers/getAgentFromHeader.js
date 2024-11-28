
const sessionTokens = require('../serviceProviders/auth/sessionTokens');


function getAgentFromSessiontoken (req) {
  let authorizationHeader = req.header('Authorization');
  console.log('authorizationHeader', authorizationHeader);
  if (authorizationHeader) {
    let splitRes = authorizationHeader.split('Bearer ');
    if (splitRes.length === 2) {
      let decodedToken = sessionTokens.validateSessionToken(splitRes[1]);
      console.log(decodedToken);
      return decodedToken.agent;
    }
  }
  return null;
}

module.exports = getAgentFromSessiontoken;