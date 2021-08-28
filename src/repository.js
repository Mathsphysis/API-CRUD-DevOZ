let usersDB = [];

module.exports.findAll = function findAll() {
    return usersDB;
}

module.exports.findOneByID = function findOneByID(id) {
    const foundUser = usersDB.filter((user) => user.nome === id);
    if(foundUser.length === 0){
        throw new Error('User not found');
    }
    return foundUser[0];
}

