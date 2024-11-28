const jwt = require('jsonwebtoken');

/** This would be in a environment variable and not stored in the repo */
let encryptionKey = 'v0HgR6d4C7FFVOMkAK90oKwlO';

function generateSessionToken(agent){
  return jwt.sign({agent: agent}, encryptionKey);
}

function validateSessionToken(token){
  try {
    let decoded = jwt.verify(token, encryptionKey);
    return decoded;
  } catch(e) {
    console.error(e);
  }
  
}

module.exports = {
  generateSessionToken,
  validateSessionToken: validateSessionToken
}