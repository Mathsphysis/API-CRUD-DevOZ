function UserService(userRepository) {

 async function findAll () {
    try{
        return await userRepository.findAll();
    } catch (err) {
        throw err;
    }
};

 async function findOneByName(name) {
  try {
      return await userRepository.findOneByName(name);
  } catch (err) {
      throw err;
  }
};

 async function save (userToSave) {
    try {
        return await userRepository.save(userToSave);
    } catch (err) {
        throw new Error(err.message);
    }
}

  async function deleteByName(id) {
    try {
        return await userRepository.deleteByName(id);
    } catch (err) {
        throw new Error(err.message);
    }
}

 async function updateByName(id, userToUpdate) {
    try {
        return await userRepository.updateByName(id, userToUpdate);
    } catch (err) {
        throw new Error(err.message);
    }
}

 async function replaceField(name, field, value) {
    try {
        return await userRepository.replaceField(name, field, value);
    } catch (err) {
        throw new Error(err.message);
    }
}

return {
    save,
    findAll,
    findOneByName,
    deleteByName,
    updateByName,
    replaceField
};

}

module.exports = UserService;