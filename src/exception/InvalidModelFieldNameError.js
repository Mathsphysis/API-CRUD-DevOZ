const BadRequestError = require('./BadRequestError');

class InvalidModelFieldsError extends BadRequestError {
    constructor(name, field) {
        super(name, `Invalid field name:\n${field}`, 'InvalidModelFieldsError');
    }
}

module.exports = InvalidModelFieldsError;