const NotFoundError = require('./NotFoundError');
const httpStatusCode = require('../utils/httpStatusCode');

class UserNotFoundError extends NotFoundError {
    constructor(name, query) {
        super(name, `User with ${query} not found`, 'UserNotFoundError');
    }
}

module.exports = UserNotFoundError;