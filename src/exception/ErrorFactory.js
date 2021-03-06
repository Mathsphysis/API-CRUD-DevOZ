const UserNotFoundError = require('./UserNotFoundError');
const InvalidModelFieldsError = require('./InvalidModelFieldsError');
const InvalidModelFieldNameError = require('./InvalidModelFieldNameError');
const InvalidPageValueError = require('./InvalidPageValueError');
const InvalidPaginationLimitValueError = require('./InvalidPaginationLimitValueError');
const InvalidOperationRequestedError = require('./InvalidOperationRequestedError');
class ErrorFactory {
    constructor() {}

    async getError(err, type){
        if(typeof type === 'string') {
            return errorTypes[type](err);
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
    },
    InvalidOperationRequestedError(err) {
        const { name, op } = err;
        throw new InvalidOperationRequestedError(name, op);
    },
    UserAlreadyExistsError(err) {
        const { name, nome } = err;
        throw new UserAlreadyExistsError(name, nome);
    }
}

module.exports = ErrorFactory;
