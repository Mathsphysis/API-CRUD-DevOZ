//Para rodar os testes, use: npm test

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const app =  require('../src/index.js');

const chai = require('chai')
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json-schema');
const server = require('../src/index.js');
const sequelize = require('../src/config/database');
const userSchema = require('./userSchema');
const User = require('../src/repository/sqlModel.js');
const usersPredefined = require('./users.js');

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

const BASE_URL = '/api/v1';

const raupp = { nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 35 };

//Inicio dos testes

//testes da aplicação
describe('Testes da aplicaçao', function () {
    // this.retries(5);

    const loadDB = async function () {
        const users = [ ...usersPredefined, raupp];
        users.forEach( async (user) => {
            return await chai.request(app)
            .post(`${BASE_URL}/users`)
            .send({ ...user });
        });
    };
    
    const cleanup = async function () {
        return await User.destroy({ truncate: true });
    }
    
    before( async () => {
        await sequelize.sync();  
    });
    
    after('cleanup geral', () => {
        server.close();
    });
    
 
    it('o servidor esta online', function (done) {
        chai.request(app)
        .get(`${BASE_URL}/`)
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.message).to.be.equal('O servidor está rodando!');
        done();
        });
    });

    it('deveria ser uma lista vazia de usuarios', function (done) {
        chai.request(app)
        .get(`${BASE_URL}/users`)
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.rows).to.eql([]);
        done();
        });
    });

    describe('Testes de criação de usuário', () => {
        after( async () => await cleanup() );
        
        it('deveria criar o usuario raupp', function (done) {
            chai.request(app)
            .post(`${BASE_URL}/users`)
            .send(raupp)
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
        });
        
        it('cria usuários predefinidos', function (done) {
            const users = [ ...usersPredefined ];
            users.forEach((user) => {
                chai.request(app)
                .post(`${BASE_URL}/users`)
                .send({ ...user })
                .end( (err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                });
            });
            done();
        });
        it('retorna status 400 para pedidos inválidos', (done) => {
            chai.request(app)
            .post(`${BASE_URL}/users`)
            .send({nome: "raupp"})
            .end(function (err, res) {
                expect(res).to.have.status(400);
                done();
            });
        });
        it('retorna campos invalidos para pedidos inválidos', (done) => {
            chai.request(app)
            .post(`${BASE_URL}/users`)
            .send({nome: "raupp"})
            .end(function (err, res) {
                expect(res.body.message).to.be.equal('Bad Request: Invalid fields:\n' +
                'notNull Violation: user.email cannot be null,' +
                '\nnotNull Violation: user.idade cannot be null');
                done();
            });
        });

    });

    describe('Testes de leitura do repositório de usuários', () => {
        beforeEach( async () => {
            await cleanup();
            return await loadDB();
        });
        after( async () => await cleanup() );
        it('deveria ser uma lista com pelo menos 5 usuarios', function (done) {
            chai.request(app)
            .get(`${BASE_URL}/users`)
            .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.total).to.be.at.least(5);
            done();
            });
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