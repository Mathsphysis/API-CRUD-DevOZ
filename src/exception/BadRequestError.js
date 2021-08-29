const BaseError = require('./BaseError');
const httpStatusCode = require('../utils/httpStatusCode');

class BadRequestError extends BaseError {
    constructor(name, cause) {
        super(name, httpStatusCode.BAD_REQUEST, true, `Bad request: ${cause}`, 'BadRequestError');
    }
}

module.exports = BadRequestError;