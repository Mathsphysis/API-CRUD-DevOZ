const BadRequestError = require('./BadRequestError');

class InvalidPageValueError extends BadRequestError {
    constructor(name, queryPage) {
        super(name, `Invalid query page value: ${queryPage}`, 'InvalidPageValueError');
    }
}

module.exports = InvalidPageValueError;