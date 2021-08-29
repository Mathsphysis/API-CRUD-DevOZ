const BadRequestError = require('./BadRequestError');

class InvalidModelFieldsError extends BadRequestError {
    constructor(name, field) {
        super(name, `Bad request: Invalid field name:\n${field}`, 'InvalidModelFieldsError');
    }
}

module.exports = InvalidModelFieldsError;