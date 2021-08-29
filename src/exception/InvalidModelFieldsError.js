const BadRequestError = require('./BadRequestError');

class InvalidModelFieldsError extends BadRequestError {
    constructor(name, cause, invalidFields) {
        super(name, `Bad request: Invalid fields:\n${cause}`, 'InvalidModelFieldsError');

        this.invalidFields = invalidFields;
    }
}

module.exports = InvalidModelFieldsError;