const BusinessLogicError = require('./BusinessLogicError');

class InvalidFieldError extends BusinessLogicError {
  /**
   * 
   * @param {string} fieldPath 
   * @param {object} errorParams 
   * @param {string} errorParams.expectedType
   * @param {any} errorParams.receivedValue
   */
  constructor(fieldPath, errorParams){
    let message = `The following field ${fieldPath} is invalid`;
    super(message, {httpStatus: 400});

    if (typeof errorParams === 'object') {
      this.expectedType = errorParams.expectedType;

      if (typeof errorParams.receivedValue !== 'undefined') {

        this.receivedValue = errorParams.receivedValue;
        this.receivedValueJSON = undefined;
        try {
          // Check if it's a value that is compatible with JSON.
          this.receivedValueJSON = JSON.parse(errorParams.receivedValue);
        } catch (e) {
        }

      }
    }
  }
}

module.exports = InvalidFieldError;