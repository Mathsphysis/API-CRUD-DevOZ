const BaseError = require('./BaseError');
const httpStatusCode = require('../utils/httpStatusCode');

class NotFoundError extends BaseError {
    constructor(name, cause, type = 'NotFoundError') {
        super(name, httpStatusCode.NOT_FOUND, true, `Not Found: ${cause}`, type);
    }
}

module.exports = NotFoundError;