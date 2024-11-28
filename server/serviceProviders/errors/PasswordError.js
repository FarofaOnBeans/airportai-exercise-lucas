const BusinessLogicError = require('../errors/BusinessLogicError');
class PasswordError extends BusinessLogicError {
  constructor(message){
    super(message, {httpStatus: 400});
  }
}

module.exports = PasswordError;