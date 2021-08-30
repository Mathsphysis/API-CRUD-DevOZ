const ErrorFactory = require("../exception/ErrorFactory");

const errorFactory = new ErrorFactory();

function UserService(userRepository) {

 async function findAll (queryPage, queryLimit) {
    try {
        let limit = 10;
        let page = 1;
        if(queryLimit !== undefined) {
            limit = parseInt(queryLimit);
        }
        if(queryPage !== undefined) {
            page = parseInt(queryPage);
        }

        if(isNaN(page) || page < 1) {
            return await invalidPageValueErrGen(queryPage); 
        }
        if(isNaN(limit) || limit < 1) {
            return await invalidPaginationLimitValueErrGen(queryLimit); 
        }

        const offset = (page - 1) * limit;
        let users = await userRepository.findAll(offset, limit);
    
        const totalPages = Math.ceil(users.count / limit);
        users.totalPages = totalPages;
        users.currentPage = page;
        return users;
    } catch(err) {
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
        await userRepository.deleteByName(id);
        return 'success';
    } catch (err) {
        throw err;
    }
}

 async function updateByName(id, userToUpdate) {
    try {
        await userRepository.updateByName(id, userToUpdate);
        return 'success';
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
            };
            return await errorFactory.getError(err, 'InvalidModelFieldNameError');
        }
        await userRepository.replaceField(name, field, value);
        return 'success';
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

async function invalidPageValueErrGen(page){
    const err = {
        name: 'Invalid Page Value Error',
        queryPage: page,
    }
    return await errorFactory.getError(err, 'InvalidPageValueError');
}

async function invalidPaginationLimitValueErrGen(limit){
    const err = {
        name: 'Invalid Pagination Limit Value Error',
        queryLimit: limit,
    }
    return await errorFactory.getError(err, 'InvalidPaginationLimitValueError');
}

module.exports = UserService;