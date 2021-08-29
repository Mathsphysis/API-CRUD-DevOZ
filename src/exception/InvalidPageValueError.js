const BadRequestError = require('./BadRequestError');

class InvalidPageValueError extends BadRequestError {
    constructor(name) {
        super(name, `Bad request: Invalid query page value`, 'InvalidPageValueError');
    }
}

module.exports = InvalidPageValueError;