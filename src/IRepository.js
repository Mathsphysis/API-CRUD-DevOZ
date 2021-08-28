class IRepository {
    constructor() {
        if(!this.findAll){
            throw new Error('Repository must have findAll method');
        }
        if(!this.findOneByID){
            throw new Error('Repository must have findOneByID method');
        }
        if(!this.save){
            throw new Error('Repository must have save method');
        }
        if(!this.deleteByID){
            throw new Error('Repository must have deleteByID method');
        }
        if(!this.update){
            throw new Error('Repository must have update method');
        }
        if(!this.replaceField){
            throw new Error('Repository must have replaceField method');
        }
    }
}

module.exports = IRepository;