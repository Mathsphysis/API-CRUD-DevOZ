class BaseError extends Error {
    constructor(name, statusCode, isOperacional, description, type) {
        super(description);

        this.name = name;
        this.statusCode = statusCode;
        this.isOperacional = isOperacional;
        this.type = type;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = BaseError;