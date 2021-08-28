const UserNotFoundError = require('../exception/UserNotFoundError');
const IRepository = require('./IRepository');
const SQLModel = require('./sqlModel');

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
            throw new UserNotFoundError('User not found error', `WHERE name='${name}'`);
        }
        return userFound;
    }

    async save(userToSave) {
        return await this.model.create({ ...userToSave });
    }

    async deleteByName(name) {
        const userToDestroy = await this.model.findOne({ where:  {nome : name } });
        if(userToDestroy) {
            return await userToDestroy.destroy({ where:  {nome : name } });
        }
        throw new UserNotFoundError('User not found error', `name: ${name}`)
    }

    async updateByName(name, userToUpdate){
        const userFound = await this.model.findOne({ where:  {nome : name } });
        if(userFound) {
            return await userFound.update(userToUpdate, { where:  {nome : name } });
        }
        throw new UserNotFoundError('User not found error', `name: ${name}`)
    }

    async replaceField(name, field, value) {
        const userFound = await this.model.findOne({ where:  {nome : name } });
        if(userFound) {
            let updateValues = {};
            updateValues[field] = value;
            return await userFound.update({ where:  {nome : name } });
;
        }
        throw new UserNotFoundError('User not found error', `name: ${name}`)
    }
}

module.exports = SQLRepository;