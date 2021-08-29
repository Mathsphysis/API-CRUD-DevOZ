class IRepository {
    constructor() {
        if(!this.findAll){
            throw new Error('Repository must have findAll method');
        }
        if(!this.findOneByName){
            throw new Error('Repository must have findOneByName method');
        }
        if(!this.save){
            throw new Error('Repository must have save method');
        }
        if(!this.deleteByName){
            throw new Error('Repository must have deleteByName method');
        }
        if(!this.updateByName){
            throw new Error('Repository must have update method');
        }
        if(!this.replaceField){
            throw new Error('Repository must have replaceField method');
        }
    }
}

module.exports = IRepository;