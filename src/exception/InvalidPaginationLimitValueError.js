const BadRequestError = require('./BadRequestError');

class InvalidPaginationLimitValueError extends BadRequestError {
    constructor(name, queryLimit) {
        super(name, `Invalid query limit value: ${queryLimit}`, 'InvalidPaginationLimitValueError');
    }
}

module.exports = InvalidPaginationLimitValueError;