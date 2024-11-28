
const Agent = require('../../models/agent');

async function getPublicAppSetupInfo(){
  let anyAgent = await Agent.findOne();


  let isAgentSetup = (anyAgent !== null);
  return {
    isAgentSetup: isAgentSetup,
  }
}

module.exports = getPublicAppSetupInfo;
