const BadRequestError = require('./BadRequestError');

class InvalidPaginationLimitValueError extends BadRequestError {
    constructor(name) {
        super(name, `Bad request: Invalid query limit value`, 'InvalidPaginationLimitValueError');
    }
}

module.exports = InvalidPaginationLimitValueError;