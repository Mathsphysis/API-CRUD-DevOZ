const BaseError = require('./BaseError');
const httpStatusCode = require('../utils/httpStatusCode');

class BadRequestError extends BaseError {
    constructor(name, cause, type = 'BadRequestError', properties = []) {
        super(name, httpStatusCode.BAD_REQUEST, true, `Bad Request: ${cause}`, type, properties);
    }
}

module.exports = BadRequestError;