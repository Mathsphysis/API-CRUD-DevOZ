function UserService(userRepository) {

 async function findAll () {
    try{
        return await userRepository.findAll();
    } catch (err) {
        throw new Error(err.message);
    }
};

 async function findOneByID(id) {
  try {
      return await userRepository.findOneByID(id);
  } catch (err) {
      throw new Error(err.message);
  }
};

 async function save (userToSave) {
    try {
        return await userRepository.save(userToSave);
    } catch (err) {
        throw new Error(err.message);
    }
}

  async function deleteByID(id) {
    try {
        return await userRepository.deleteByID(id);
    } catch (err) {
        throw new Error(err.message);
    }
}

 async function updateByID(id, userToUpdate) {
    try {
        return await userRepository.updateByID(id, userToUpdate);
    } catch (err) {
        throw new Error(err.message);
    }
}

 async function replaceField(id, field, value) {
    try {
        return await userRepository.replaceField(id, field, value);
    } catch (err) {
        throw new Error(err.message);
    }
}

return {
    save,
    findAll,
    findOneByID,
    deleteByID,
    updateByID,
    replaceField
};

}

module.exports = UserService;