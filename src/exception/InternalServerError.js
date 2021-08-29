const BaseError = require('./BaseError');
const httpStatusCode = require('../utils/httpStatusCode');

class InternalServerError extends BaseError {
    constructor(name, description = `Internal Server Error`) {
        super(name, httpStatusCode.INTERNAL_SERVER_ERROR, true, description, 'InternalServerError');
    }
}

module.exports = InternalServerError;