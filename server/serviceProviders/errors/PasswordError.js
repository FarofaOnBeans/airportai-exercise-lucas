const BusinessLogicError = require('../errors/BusinessLogicError');
class PasswordError extends BusinessLogicError {
  constructor(message){
    super(message);
  }
}

module.exports = PasswordError;