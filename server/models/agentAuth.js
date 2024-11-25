const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// agentAuth contains authentication data of the user (field `agent`).
// This is to help isolating sensitive data from popular general queries regarding the Agent.

const AgentAuth = new Schema({
  agent: { type: Schema.Types.ObjectId, ref: 'agent', required: true },
  passwd: {type: String}
});

module.exports = mongoose.model('AgentAuth', AgentAuth);

