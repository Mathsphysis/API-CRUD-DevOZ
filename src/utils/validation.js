const ErrorFactory = require("../exception/ErrorFactory");

const Regex = require('../config/regexValidators');

const errorFactory = new ErrorFactory();

async function validate(arg, opt) {
    const validationErrors = {};
    validationErrors.errors = [];
    validationErrors.message = '';

    if(opt.field) {
        validationErrors.errors = await validateOptions[opt.field](arg);
    }
    if(opt.user) {
        validationErrors.errors = await validateOptions[opt.user](arg);
    }
  
    if(validationErrors.errors.length === 0){
      return "sucess";
    }

    for( let i = 0; i < validationErrors.errors.length; i++) {
        if( i > 0 ){
            validationErrors.message += ', ' + validationErrors.errors[i];
        } else {
            validationErrors.message += validationErrors.errors[i];
        }
    }
  
    return await invalidFieldsErrGen(validationErrors);
  }
  
  async function validateField(field, value) {
    if(validation[field]){
      return await validation[field](value);
    }
  }

  const validateOptions = {
    async user(userToValidate) {
        const errors = [];
        const validateFields = ['nome', 'idade', 'email'];
        validateFields.forEach(async (field) =>  {
            if(!userToValidate[field]) {
                errors.push(`\nnotNull Violation: user.${field} cannot be null`);
            }
            const validationError = await validateField(field, userToValidate[field]);
            if(validationError){
              errors.push(validationError);
            }
        });
        return errors;
    },
    async field({ field, value }) {
      const errors = [];
      const validationError = await validateField(field, value);
      if(validationError){
        errors.push(validationError);
      }
    }
  }
  
  const validation = {
    async nome(value) {
      if(typeof value === "string") {
        if(!Regex.nameRegex.test(value)){
          return '\nValidation error: Validation is on nome failed';
        }
      } 
      return;
    },
    async email(value) {
      if(typeof value === "string") {
        if(!Regex.emailRegex.test(value)){
          return '\nValidation error: Validation is on email failed';
        }
      }
      return;
    },
    async idade(value) {
      if(typeof value === "number") {
        if(value < 18){
          return '\nValidation error: Validation min on idade failed';
        }
      }
      return;
    }
  }

  async function invalidFieldsErrGen(validationErrors) {
    const err = {
      name: "Invalid model fields error",
      invalidFields: validationErrors.errors,
      message: validationErrors.message,
    };
    return await errorFactory.getError(err, "InvalidModelFieldsError");
  }

module.exports = validate;