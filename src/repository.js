let usersDB = [];

module.exports.findAll = async function () {
    return usersDB;
}

module.exports.findOneByID = async function (id) {
    const foundUser = usersDB.filter((user) => user.nome === id);
    if(foundUser.length === 0){
        throw new Error('User not found');
    }
    return foundUser[0];
}

module.exports.save = async function save(user) {
    const userToSave = { ...user };
    usersDB.push(userToSave);
    return userToSave;
}

module.exports.delete = async function (id) {
    const indexToDelete = usersDB.map(user => user.nome).indexOf(id);
    const userDeleted = usersDB.splice(indexToDelete, 1);
    if(userDeleted.length === 0){
        throw new Error('User not found');
    }
}

module.exports.update = async function (id, userToUpdate) {
    try {
        await this.findOneByID(id);
        const indexToUpdate = usersDB.map(user => user.nome).indexOf(id);
        usersDB[indexToUpdate] = userToUpdate;
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports.replaceField = async function (id, field, value) {
    try {
        await this.findOneByID(id);
        const indexToUpdate = usersDB.map(user => user.nome).indexOf(id);
        usersDB[indexToUpdate][field] = value;
    } catch (err) {
        throw new Error(err.message);
    }
}

