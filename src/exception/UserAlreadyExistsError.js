const BadRequestError = require('./BadRequestError');

class UserAlreadyExistsError extends BadRequestError {
    constructor(name, nome) {
        super(name, `User Already Exists: ${nome}`, 'UserAlreadyExistsError');
    }
}

module.exports = UserAlreadyExistsError;