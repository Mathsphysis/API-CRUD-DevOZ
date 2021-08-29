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

const raupp = { nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 35 };

//Inicio dos testes

//testes da aplicação
describe('Testes unitários para service',  () => {

    const loadDB = async function (usersToLoad = usersPredefined) {
        const users = [ ...usersToLoad];
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
            expect(user.email).to.be.equal("jose.raupp@devoz.com.br");
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
                expect(err.invalidFields).to.be.equal('InvalidModelFieldsError');
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
            expect(users).to.have.property(total);
            expect(users.total).to.be.equal(5);
        });
        it('o usuario naoExiste não existe no sistema', function (done) {
            chai.request(app)
            .get(`${BASE_URL}/users/naoExiste`)
            .end(function (err, res) {
                expect(res.body.message).to.be.equal('Not Found: User with WHERE name=\'naoExiste\' not found'); 
                expect(res).to.have.status(404);
                done();
            });
        });
    
        it('o usuario raupp existe e é valido', function (done) {
            chai.request(app)
            .get(`${BASE_URL}/users/raupp`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.jsonSchema(userSchema);
                done();
            });
        });
        it('retorna os resultados com paginação', (done) => {
            chai.request(app)
            .get(`${BASE_URL}/users?page=2`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.currentPage).to.be.equal(2);
                done();
            });
        });
        it('retorna os resultados com paginação com limite definido pelo cliente', (done) => {
            const users = [ ...usersPredefined, raupp ];
            const limit = 2;
            const page = 1;
            const total = users.length;
            const totalPages = Math.ceil(total / limit);
            const isLastPage = page === totalPages;
            const lastPageCount = total - (totalPages - 1) * limit;
            const count = isLastPage ? lastPageCount : limit;
            chai.request(app)
            .get(`${BASE_URL}/users?page=${page}&limit=${limit}`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body.totalPages).to.be.equal(totalPages);
                expect(res.body.currentPageUsersCount).to.be.equal(count);

                done();
            });
        });

        it('retorna erro se a pagina definida pelo cliente for invalida', (done) => {
            const limit = 2;
            const page = 'paginaInvalida';
            chai.request(app)
            .get(`${BASE_URL}/users?page=${page}&limit=${limit}`)
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('Bad Request: Invalid query page value: paginaInvalida');
                done();
            });
        });

        it('retorna erro se o limite definido pelo cliente for invalido', (done) => {
            const limit = 'limiteInvalido';
            const page = 1;
            chai.request(app)
            .get(`${BASE_URL}/users?page=${page}&limit=${limit}`)
            .end(function (err, res) {
                expect(res).to.have.status(400);
                expect(res.body.message).to.be.equal('Bad Request: Invalid query limit value: limiteInvalido');
                done();
            });
        });

        
    });


    describe('Testes de atualização do repositório de usuários', () => {
        beforeEach( async () => {
            await cleanup();
            return await loadDB();
        });

        it('atualiza todos os campos do usuário', (done) => {
            const userToUpdate = { nome:"fernando", email:"fernando@devoz.com.br", idade:31 };
            chai.request(app)
            .put(`${BASE_URL}/users/${userToUpdate['nome']}`)
            .send(userToUpdate)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204)
                done();
            });
        });
        it('atualiza o campo idade do usuário', (done) => {
            const nome = "fernando";
            const fieldPatch = {op: "replace", path: `/idade`, value: 45};
            chai.request(app)
            .patch(`${BASE_URL}/users/${nome}`)
            .send(fieldPatch)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204)
                done();
            });
        });
        it('atualiza o campo email do usuário', (done) => {
            const nome = "fernando";
            const fieldPatch = {op: "replace", path: `/email`, value: "fernando@mail.com"};
            chai.request(app)
            .patch(`${BASE_URL}/users/${nome}`)
            .send(fieldPatch)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204)
                done();
            });
        });
        it('retorna status 400 para pedidos inválidos no PUT', (done) => {
            const userToUpdate = { nome:"fernando" };
            chai.request(app)
            .put(`${BASE_URL}/users/${userToUpdate['nome']}`)
            .send({nome: "raupp"})
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
        });
        it('retorna campos invalidos para pedidos inválidos no PUT', (done) => {
            const userToUpdate = { nome:"fernando" };
            chai.request(app)
            .put(`${BASE_URL}/users/${userToUpdate['nome']}`)
            .send({nome: "raupp"})
            .end(function (err, res) {
                expect(res.body.message).to.be.equal('Bad Request: Invalid fields:\n' +
                'notNull Violation: user.email cannot be null,' +
                '\nnotNull Violation: user.idade cannot be null');
                done();
            });
        });
        it('retorna erro para operações inválidas no PATCH', (done) => {
            const nome = "fernando";
            const fieldPatch = {op: "rep", path: `/email`, value: "fernando@mail.com"};
            chai.request(app)
            .patch(`${BASE_URL}/users/${nome}`)
            .send(fieldPatch)
            .end(function (err, res) {
                expect(res.status).to.be.equal(400);
                expect(res.body.message).to.be.equal(`Bad Request: Invalid operation requested: ${fieldPatch.op}`);
                done();
            });
        });
        it('retorna erro para campos de modelo inválidos no PATCH', (done) => {
            const nome = "fernando";
            const fieldPatch = {op: "replace", path: `/ema`, value: "fernando@mail.com"};
            chai.request(app)
            .patch(`${BASE_URL}/users/${nome}`)
            .send(fieldPatch)
            .end(function (err, res) {
                expect(res.status).to.be.equal(400);
                expect(res.body.message).to.be.equal('Bad Request: Invalid field name:\nema is not a valid model field');
                done();
            });
        });

        const tests = [
            { 
                field: 'email', 
                value: 'invalidEmail', 
                expectedMessage: 'Bad Request: Invalid fields:\nValidation error: Validation is on email failed'
            },
            { 
                field: 'idade', 
                value: 16, 
                expectedMessage: 'Bad Request: Invalid fields:\nValidation error: Validation min on idade failed'
            },
        ]

        tests.forEach( ({field, value, expectedMessage}) => {
            it(`retorna erro para ${field} inválido no PATCH`, (done) => {
                const nome = "fernando";
                const fieldPatch = {op: "replace", path: `/${field}`, value: value};
                chai.request(app)
                .patch(`${BASE_URL}/users/${nome}`)
                .send(fieldPatch)
                .end(function (err, res) {
                    expect(res.status).to.be.equal(400);
                    expect(res.body.message).to.be.equal(expectedMessage);
                    done();
                });
            });
        });
        
        it('retorna erro caso o usuário não exista no PUT', (done) => {
            chai.request(app)
            .put(`${BASE_URL}/users/naoExiste`)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal('Not Found: User with WHERE name=\'naoExiste\' not found');
                done();
            });
        });
        it('retorna erro caso o usuário não exista no PATCH', (done) => {
            const fieldPatch = {op: "replace", path: `/email`, value: "fernando@mail.com"};
            chai.request(app)
            .patch(`${BASE_URL}/users/naoExiste`)
            .send(fieldPatch)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal('Not Found: User with WHERE name=\'naoExiste\' not found');
                done();
            });
        });
    });

    describe('Testes de exclusão de usuários do repositório', () => {
        before( async () => await loadDB() );
        after( async () => await cleanup() );
        it('deveria excluir o usuario raupp', function (done) {
            chai.request(app)
            .delete(`${BASE_URL}/users/raupp`)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(204);
                done();
            });
        });
    
        it('o usuario raupp não deve existir mais no sistema', function (done) {
            chai.request(app)
            .get(`${BASE_URL}/users/raupp`)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                done();
            });
        });
        it('retorna erro caso o usuário não exista', (done) => {
            chai.request(app)
            .delete(`${BASE_URL}/users/naoExiste`)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.message).to.be.equal('Not Found: User with WHERE name=\'naoExiste\' not found');
                done();
            });
        });
    });
    
})