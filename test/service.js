//Para rodar os testes, use: npm test

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const app =  require('../src/index.js');
const UserService = require('../src/service/service');
const UserRepository = require('../src/repository/arrayRepository');
const chai = require('chai')

const usersPredefined = require('./users.js');
const userSchema = require('./userSchema');

const expect = chai.expect;

const userRepository = new UserRepository();

const userService = new UserService(userRepository);

const raupp = { nome: 'raupp', email: 'jose.raupp@devoz.com.br', idade: 35 };

//Inicio dos testes

//testes da aplicação
describe('Testes unitários para service',  () => {

    const loadDB = async function (usersToLoad = usersPredefined) {
        const users = [ ...usersToLoad, raupp];
        await userRepository.loadDB(users);
    };
    
    const cleanup = async function () {
        return await userRepository.loadDB([]);
    }

    it('deveria ser uma lista vazia de usuarios', async function () {
        const users = await userService.findAll();
    });

    describe('Testes de criação de usuário', () => {
        after( async () => await cleanup() );
        
        it('deveria criar o usuario raupp', async function () {
            const user = await userService.save(raupp);
            expect(user.nome).to.be.equal('raupp');
            expect(user.idade).to.be.equal(35);
            expect(user.email).to.be.equal('jose.raupp@devoz.com.br');
        });
        
        it('cria usuários predefinidos', async function () {
            const users = [ ...usersPredefined ];
            users.forEach(async (user) => {
                const userSaved = await userService.save(user);
                expect(userSaved).to.be.jsonSchema(userSchema);
            });
            
        });

        it('retorna erro para pedidos inválidos', async () => {
            const invalidUser = {nome: 'usuario invalido'};
            try {
                await userService.save(invalidUser);
            } catch (err) {
                expect(err).to.haveOwnProperty('type');
                expect(err.type).to.be.equal('InvalidModelFieldsError');
            }
        });

        it('retorna campos invalidos para pedidos inválidos', async () => {
            const invalidUser = {nome: 'usuario invalido'};
            try {
                await userService.save(invalidUser);
            } catch (err) {
                expect(err).to.haveOwnProperty('invalidFields');
                expect(err.invalidFields.length).to.be.equal(2);
            }
        });

    });

    describe('Testes de leitura do repositório de usuários', () => {
        beforeEach( async () => {
            await cleanup();
            return await loadDB();
        });
        after( async () => await cleanup() );
        it('deveria ser uma lista com pelo menos 5 usuarios', async function () {
            const users = await userService.findAll();
            expect(users).to.have.property('count');
            expect(users.count).to.be.equal(6);
        });
        it('o usuario naoExiste não existe no sistema', async function () {
            try {
                await userService.findOneByName('naoExiste');
            } catch (err) {
                expect(err).to.have.property('type');
                expect(err.type).to.be.equal('UserNotFoundError');
            }
        });
    
        it('o usuario raupp existe e é valido', async function () {
            const user = await userService.findOneByName('raupp');
            expect(user).to.be.jsonSchema(userSchema);
        });
        it('retorna os resultados com paginação', async  () => {
            const page = '1';
            const users = await userService.findAll(page);
            expect(users).to.have.property('count');
            expect(users).to.have.property('totalPages');
            expect(users).to.have.property('rows');
            expect(users).to.have.property('currentPage');
        });
        it('retorna os resultados com paginação com limite definido pelo cliente', async  () => {
            const usersDB = [ ...usersPredefined, raupp ];
            const queryLimit = '2';
            const queryPage = '1';
            const limit = +queryLimit;
            const page = +queryPage;
            const total = usersDB.length;
            const totalPages = Math.ceil(total / limit);
            const isLastPage = page === totalPages;
            const lastPageCount = total - (totalPages - 1) * limit;
            const count = isLastPage ? lastPageCount : limit;
            const usersProvided = await userService.findAll(queryPage, queryLimit);
            expect(usersProvided).to.have.property('rows');
            expect(usersProvided.rows.length).to.be.lessThanOrEqual(limit);
        });

        it('retorna erro se a pagina definida pelo cliente for invalida', async  () => {
            const queryLimit = '2';
            const queryPage = 'paginaInvalida';
            try {
                await userService.findAll(queryPage, queryLimit);
            } catch (err) {
                expect(err).to.have.property('type');
                expect(err.type).to.be.equal('InvalidPageValueError');
            }
        });

        it('retorna erro se o limite definido pelo cliente for invalido', async  () => {
            const queryLimit = 'limite invalido';
            const queryPage = '1';
            try {
                await userService.findAll(queryPage, queryLimit);
            } catch (err) {
                expect(err).to.have.property('type');
                expect(err.type).to.be.equal('InvalidPaginationLimitValueError');
            }
        });

        
    });


    describe('Testes de atualização do repositório de usuários', () => {
        beforeEach( async () => {
            await cleanup();
            return await loadDB();
        });

        it('atualiza todos os campos do usuário', async  () => {
            const userToUpdate = { nome:'fernando', email:'fernando@devoz.com.br', idade:31 };
            const result = await userService.updateByName(userToUpdate.nome, userToUpdate);
            expect(result).to.be.equal('success');
        });
        it('atualiza o campo idade do usuário', async  () => {
            const nome = 'fernando';
            const field = 'idade';
            const value = 45;
            const result = await userService.replaceField(nome, field, value);
            expect(result).to.be.equal('success');
        });
        it('atualiza o campo email do usuário', async  () => {
            const nome = 'fernando';
            const field = 'email';
            const value = 'fernando@mail.com';
            const result = await userService.replaceField(nome, field, value);
            expect(result).to.be.equal('success');
        });
        it('retorna campos inválidos para pedidos inválidos de atualização', async  () => {
            const userToUpdate = { nome:'fernando' };
            try {
                await userService.updateByName(userToUpdate.nome, userToUpdate);
            } catch (err) {
                expect(err).to.haveOwnProperty('type');
                expect(err.type).to.be.equal('InvalidModelFieldsError');
                expect(err).to.haveOwnProperty('invalidFields');
                expect(err.invalidFields.length).to.be.equal(2);
            }
        });

        const tests = [
            { 
                field: 'email', 
                value: 'invalidEmail', 
                expectedType: 'InvalidModelFieldsError'
            },
            { 
                field: 'idade', 
                value: 16, 
                expectedType: 'InvalidModelFieldsError'
            },
            {
                field: 'ida',
                value: 45,
                expectedType: 'InvalidModelFieldNameError'
            }
        ]

        tests.forEach( ({field, value, expectedType}) => {
            it(`retorna erro para ${field} inválido usando replaceField`, async  () => {
                const nome = 'fernando';
                try {
                    await userService.replaceField(nome, field, value);
                } catch (err) {
                    expect(err).to.have.property('type');
                    expect(err.type).to.be.equal(expectedType);
                }
            });
        });
        
        it('retorna erro caso o usuário não exista usando updateByName', async  () => {
            const nome = 'naoExiste';
            const email = 'naoExiste@mail.com';
            const idade = 40;
            const userToUpdate = { nome, idade,  email}
                try {
                    await userService.updateByName(nome, userToUpdate);
                } catch (err) {
                    expect(err).to.have.property('type');
                    expect(err.type).to.be.equal('UserNotFoundError');
                }
        });
        it('retorna erro caso o usuário não exista usando replaceField', async  () => {
            const nome = 'naoExiste';
            const field = 'email';
            const value = 'fernando@mail.com';
            try {
                await userService.replaceField(nome, field, value);
            } catch (err) {
                expect(err).to.have.property('type');
                expect(err.type).to.be.equal('UserNotFoundError');
            }
        });
    });

    describe('Testes de exclusão de usuários do repositório', () => {
        before( async () => await loadDB() );
        after( async () => await cleanup() );
        it('deveria excluir o usuario raupp', async function () {
            const result = await userService.deleteByName('raupp'); 
        });
    
        it('o usuario raupp não deve existir mais no sistema', async function () {
            const nome = 'raupp';
            await userService.deleteByName(nome); 
            try {
                await userService.findOneByName(nome);
            } catch (err) {
                expect(err).to.have.property('type');
                expect(err.type).to.be.equal('UserNotFoundError');
            }
        });
        it('retorna erro caso o usuário não exista', async  () => {
            const nome = 'naoExiste';
            try {
                await userService.deleteByName(nome);
            } catch (err) {
                expect(err).to.have.property('type');
                expect(err.type).to.be.equal('UserNotFoundError');
            }
        });
    });
    
})