const IRepository = require('./IRepository');

class ArrayRepository extends IRepository {
    constructor(usersDB = []) {
        super();
        this.usersDB = usersDB;
    }

    async findAll() {
        return this.usersDB;
      }
    
      async findOneByID(id) {
        const foundUser = this.usersDB.filter((user) => user.nome === id);
        if (foundUser.length === 0) {
          throw new Error("User not found");
        }
        return foundUser[0];
      }
    
      async save(user) {
        const userToSave = { ...user };
        this.usersDB.push(userToSave);
        return userToSave;
      }
    
      async deleteByID(id) {
        const indexToDelete = this.usersDB.map((user) => user.nome).indexOf(id);
        const userDeleted = this.usersDB.splice(indexToDelete, 1);
        if (userDeleted.length === 0) {
          throw new Error("User not found");
        }
      }
    
      async updateByID(id, userToUpdate) {
        try {
          await this.findOneByID(id);
          const indexToUpdate = this.usersDB.map((user) => user.nome).indexOf(id);
          this.usersDB[indexToUpdate] = userToUpdate;
        } catch (err) {
          throw new Error(err.message);
        }
      }
    
      async replaceField(id, field, value) {
        try {
          await this.findOneByID(id);
          const indexToUpdate = this.usersDB.map((user) => user.nome).indexOf(id);
          this.usersDB[indexToUpdate][field] = value;
        } catch (err) {
          throw new Error(err.message);
        }
      }

    }

module.exports = ArrayRepository;