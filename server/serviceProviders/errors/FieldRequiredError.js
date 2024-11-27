const BusinessLogicError = require('./BusinessLogicError');

class FieldRequiredError extends BusinessLogicError {
  constructor(fieldPath){
    let message = `The following field ${fieldPath} is missing`;
    super(message, {httpStatus: 400});
  }
}

module.exports = FieldRequiredError;