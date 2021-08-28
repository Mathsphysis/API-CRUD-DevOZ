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

    async findOneByID(id) {
        const userFound = await this.model.findOne({ where:  {nome : id } });
        if(!userFound){
            throw new Error('User not found');
        }
        return userFound;
    }

    async save(userToSave) {
        return await this.model.create({ ...userToSave });
    }

    async deleteByID(id) {
        const userToDestroy = await this.model.findOne({ where:  {nome : id } });
        if(userToDestroy) {
            await userToDestroy.destroy({ where:  {nome : id } });
            return "sucess";
        }
        throw new Error('User not found');
    }

    async updateByID(id, userToUpdate){
        const userFound = await this.model.findOne({ where:  {nome : id } });
        if(userFound) {
            await userFound.update(userToUpdate, { where:  {nome : id } });
            return "sucess";
        }
        throw new Error('User not found');
    }

    async replaceField(id, field, value) {
        const userFound = await this.model.findOne({ where:  {nome : id } });
        if(userFound) {
            let updateValues = {};
            updateValues[field] = value;
            const userUpdated = await userFound.update({ where:  {nome : id } });
            return "sucess";
        }
        throw new Error('User not found');
    }
}

module.exports = SQLRepository;