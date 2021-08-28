const BaseError = require('./BaseError');
const httpStatusCode = require('../utils/httpStatusCode');

class UserNotFoundError extends BaseError {
    constructor(name, query) {
        super(name, httpStatusCode.NOT_FOUND, true, `User with ${query} not found`, 'UserNotFoundError');
    }
}

module.exports = UserNotFoundError;