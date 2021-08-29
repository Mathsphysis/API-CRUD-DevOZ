const ErrorFactory = require("../exception/ErrorFactory");

const errorFactory = new ErrorFactory();

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
        throw err;
    }
}

  async function deleteByName(id) {
    try {
        return await userRepository.deleteByName(id);
    } catch (err) {
        throw err;
    }
}

 async function updateByName(id, userToUpdate) {
    try {
        return await userRepository.updateByName(id, userToUpdate);
    } catch (err) {
        throw err;
    }
}

 async function replaceField(name, field, value) {
    try {
        const validField = validFields[field];
        if(!validField) {
            const err = {
                name: 'Invalid Model Field Name Error',
                field: `${field} is not a valid model field`,
                type: 'InvalidModelFieldNameError'
            };
            return await errorFactory.getError(err);
        }
        return await userRepository.replaceField(name, field, value);
    } catch (err) {
        throw err;
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

const validFields = {
    nome: 'nome',
    email: 'email',
    idade: 'idade'
}

module.exports = UserService;