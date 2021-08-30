class BaseError extends Error {
    constructor(name, statusCode, isOperacional, description, type, properties = []) {
        super(description);

        this.name = name;
        this.statusCode = statusCode;
        this.isOperacional = isOperacional;
        this.type = type;
        this.properties = properties;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = BaseError;