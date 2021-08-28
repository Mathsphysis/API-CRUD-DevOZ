const UserRepository = require("./repository");

module.exports.findAll = async function () {
    try{
        return await UserRepository.findAll();
    } catch (err) {
        throw new Error(err.message);
    }
};

module.exports.findOneByID = async function (id) {
  try {
      return await UserRepository.findOneByID(id);
  } catch (err) {
      throw new Error(err.message);
  }
};

module.exports.save = async function (userToSave) {
    try {
        return await UserRepository.save(userToSave);
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports.delete = async function (id) {
    try {
        return await UserRepository.delete(id);
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports.update = async function (id, userToUpdate) {
    try {
        return await UserRepository.update(id, userToUpdate);
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports.replaceField = async function (id, field, value) {
    try {
        return await UserRepository.replaceField(id, field, value);
    } catch (err) {
        throw new ErrorEvent(err.message);
    }
}