const BadRequestError = require('./BadRequestError');

class InvalidOperationRequestedError extends BadRequestError {
    constructor(name, op) {
        super(name, `Invalid operation requested: ${op}`, 'InvalidOperationRequestedError');
    }
}

module.exports = InvalidOperationRequestedError;