const IRepository = require("./IRepository");
const ErrorFactory = require("../exception/ErrorFactory");

const validate = require('../utils/validation');

const errorFactory = new ErrorFactory();

class ArrayRepository extends IRepository {
  constructor(usersDB = []) {
    super();
    this.usersDB = usersDB;
  }

  async loadDB(usersToLoad) {
    this.usersDB = usersToLoad;
  }

  async findAll(offset, limit) {
    const end = offset + limit;
    const userRows = usersDB.slice(offset, end);
    const users = {
      rows: userRows,
      count: this.usersDB.length
    }
    return users;
  }

  async findOneByName(name) {
    const foundUser = this.usersDB.filter((user) => user.nome === name);
    if (foundUser.length === 0) {
      return await userNotFoundErrGen(name);
    }
    return foundUser[0];
  }

  async save(user) {
    const userToSave = { ...user };
    try {
      await validate(userToSave, {user: 'user'});
      this.usersDB.push(userToSave);
      return userToSave;
    } catch (err) {
      throw err;
    }
  }

  async deleteByName(name) {
    const indexToDelete = this.usersDB.map((user) => user.nome).indexOf(name);
    const userDeleted = this.usersDB.splice(indexToDelete, 1);
    if (userDeleted.length === 0) {
      return await userNotFoundErrGen(name);
    }
  }

  async updateByName(name, userToUpdate) {
    try {
      await this.findOneByName(name);
      await validate(userToUpdate, {user: 'user'});
      const indexToUpdate = this.usersDB.map((user) => user.nome).indexOf(name);
      this.usersDB[indexToUpdate] = userToUpdate;
    } catch (err) {
      throw err;
    }
  }

  async replaceField(name, field, value) {
    try {
      await this.findOneByName(name);
      const validationField = { field, value };
      await validate(validationField, {field: 'field'});
      const indexToUpdate = this.usersDB.map((user) => user.nome).indexOf(name);
      this.usersDB[indexToUpdate][field] = value;
    } catch (err) {
      throw err;
    }
  }
}

async function userNotFoundErrGen(resourceName) {
  const err = {
    name: "User not found error",
    query: `WHERE name='${resourceName}'`,
    type: "UserNotFoundError",
  };
  return await errorFactory.getError(err);
}



module.exports = ArrayRepository;
