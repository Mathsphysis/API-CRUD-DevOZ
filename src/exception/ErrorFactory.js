const UserNotFoundError = require('./UserNotFoundError');
const InvalidModelFieldsError = require('./InvalidModelFieldsError');
const InvalidModelFieldNameError = require('./InvalidModelFieldNameError');
const InvalidPageValueError = require('./InvalidPageValueError');
const InvalidPaginationLimitValueError = require('./InvalidPaginationLimitValueError');

class ErrorFactory {
    constructor() {}

    async getError(err){
        if( Object.prototype.hasOwnProperty.call(err, 'type') ) {
            return errorTypes[err.type](err);
        }
    }
}

const errorTypes = {
    UserNotFoundError(err) {
        const { name, query } = err;
        throw new UserNotFoundError(name, query);
    },
    InvalidModelFieldsError(err) {
        const { name, message, invalidFields } = err;
        throw new InvalidModelFieldsError(name, message, invalidFields);
    },
    InvalidModelFieldNameError(err) {
        const { name, field } = err;
        throw new InvalidModelFieldNameError(name, field);
    },
    InvalidPaginationLimitValueError(err) {
        const { name, queryLimit } = err;
        throw new InvalidPaginationLimitValueError(name, queryLimit);
    },
    InvalidPageValueError(err) {
        const { name, queryPage } = err;
        throw new InvalidPageValueError(name, queryPage);
    }
}

module.exports = ErrorFactory;
