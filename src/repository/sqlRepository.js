const UserNotFoundError = require('../exception/UserNotFoundError');
const ErrorFactory = require('../exception/ErrorFactory');
const IRepository = require('./IRepository');
const SQLModel = require('./sqlModel');

const errorFactory = new ErrorFactory();

class SQLRepository extends IRepository {
    constructor() {
        super();
        this.model = SQLModel;
    }

    async findAll() {
        return await this.model.findAll();
    }

    async findOneByName(name) {
        const userFound = await this.model.findOne({ where:  {nome : name } });
        if(!userFound){
            return await userNotFoundErrGen(name);
        }
        return userFound;
    }

    async save(userToSave) {
        try {
            return await this.model.create({ ...userToSave });
        } catch (validationErrors) {
            return await invalidFieldsErrGen(validationErrors);
        }
    }

    async deleteByName(name) {
        const userToDestroy = await this.model.findOne({ where:  {nome : name } });
        if(!userToDestroy) {
            return await userNotFoundErrGen(name);
        }
        return await userToDestroy.destroy({ where:  {nome : name } });
    }

    async updateByName(name, userToUpdate){
        const userFound = await this.model.findOne({ where:  {nome : name } });
        if(!userFound) {
            return await userNotFoundErrGen(name);
        }
        const userModelToUpdate = this.model.build(userToUpdate, { isNewRecord: false });
        try{
            await userModelToUpdate.validate();
            return await userFound.update(userToUpdate, { where:  {nome : name } });
        } catch (validationErrors) {
            return await invalidFieldsErrGen(validationErrors);
        }
    }

    async replaceField(name, field, value) {
        const userFound = await this.model.findOne({ where:  {nome : name } });
        if(!userFound) {
            return await userNotFoundErrGen(name);
        }
        let updateValues = {};
        updateValues[field] = value;
        try {
            await userFound.update(updateValues, { where:  {nome : name } });
        } catch (validationErrors) {
            return await invalidFieldsErrGen(validationErrors);
        }
    }

}

async function invalidFieldsErrGen(validationErrors) {
    const err = { 
        name: 'Invalid model fields error', 
        invalidFields: validationErrors.errors, 
        message: validationErrors.message, 
        type: 'InvalidModelFieldsError' 
    };
    return await errorFactory.getError(err);
}

async function userNotFoundErrGen(resourceName) {
    const err = { name: 'User not found error', query: `WHERE name='${resourceName}'`, type: 'UserNotFoundError' };
    return await errorFactory.getError(err);
}
module.exports = SQLRepository;