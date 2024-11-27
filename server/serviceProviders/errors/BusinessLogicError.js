class BusinessLogicError extends Error {
  constructor(message, errorParams){
    super(message);

    if (typeof errorParams === 'object') {
      this.httpStatus = errorParams.httpStatus;
    }
    
  }

};

module.exports = BusinessLogicError;

