const httpStatusCode = require('../utils/httpStatusCode');
const BaseError = require('./BaseError');

class FactoryError extends BaseError {
    constructor(description){
        super('Factory Error', httpStatusCode.INTERNAL_SERVER_ERROR, false,  description);
    }
}

module.exports = FactoryError;