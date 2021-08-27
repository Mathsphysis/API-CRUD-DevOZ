//sample test
//Para rodar os testes, use: npm test
//PS: Os testes não estão completos e alguns podem comnter erros.

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

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

//Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um arquivo separado
const userSchema = {
    title: "Schema do Usuario, define como é o usuario, linha 24 do teste",
    type: "object",
    required: ['nome', 'email', 'idade'],
    properties: {
        nome: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        idade: {
            type: 'number',
            minimum: 18
        }
    }
}

//Inicio dos testes

//testes da aplicação
describe('Testes da aplicaçao',  () => {

    after('cleanup', () => {
        server.close();
    });
    it('o servidor esta online', function (done) {
        chai.request(app)
        .get('/')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        done();
        });
    });

    it('deveria ser uma lista vazia de usuarios', function (done) {
        chai.request(app)
        .get('/users')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.rows).to.eql([]);
        done();
        });
    });

    describe('Testes de criação de usuário', () => {
        it('deveria criar o usuario raupp', function (done) {
            chai.request(app)
            .post('/users')
            .send({nome: "raupp", email: "jose.raupp@devoz.com.br", idade: 35})
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
                done();
            });
        });
        
        it('cria usuários predefinidos', function (done) {
            const users = [
                {
                    nome: "marcela",
                    email: "marcela@email.com",
                    idade: 28
                },
                {
                    nome: "fernando",
                    email: "fernando@gmail.com",
                    idade: 30
                }, 
                {
                    nome: "ricardo",
                    email: "ricardo@email.com",
                    idade: 19
                },
                {
                    nome: "gabriela",
                    email: "gabriela@gmail.com",
                    idade: 23
                },
                {
                    nome: "isabela",
                    email: "isabela@email.com",
                    idade: 25
                }
            ];
            users.forEach((user) => {
                chai.request(app)
                .post('/users')
                .send({ ...user })
                .end( (err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                });
            });
            done();
        });
    });

    describe('Testes de leitura do repositório de usuários', () => {
        it('o usuario naoExiste não existe no sistema', function (done) {
            chai.request(app)
            .get('/users/naoExiste')
            .end(function (err, res) {
                expect(err.response.body.error).to.be.equal('User not found'); //possivelmente forma errada de verificar a mensagem de erro
                expect(res).to.have.status(404);
                expect(res.body).to.be.jsonSchema(userSchema);
                done();
            });
        });
    
        it('o usuario raupp existe e é valido', function (done) {
            chai.request(app)
            .get('/users/raupp')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.jsonSchema(userSchema);
                done();
            });
        });

        it('deveria ser uma lista com pelo menos 5 usuarios', function (done) {
            chai.request(app)
            .get('/users')
            .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body.total).to.be.at.least(5);
            done();
            });
        });
    });


    describe('Testes de atualização do repositório de usuários', () => {
        it('atualiza todos os campos do usuário', (done) => {
            const userToUpdate = { nome:"fernando", email:"fernando@devoz.com.br", idade:31 };
            chai.request(app)
            .put(`/users/${userToUpdate['nome']}`)
            .send(userToUpdate)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204)
            });
            done();
        });
        it('atualiza o campo idade do usuário', (done) => {
            const nome = "fernando";
            const fieldPatch = {op: "replace", path: `/idade`, value: "45"};
            chai.request(app)
            .patch(`/users/${nome}`)
            .send(fieldPatch)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204)
            });
            done();
        });
        it('atualiza o campo email do usuário', (done) => {
            const nome = "fernando";
            const fieldPatch = {op: "replace", path: `/email`, value: "fernando@mail.com"};
            chai.request(app)
            .patch(`/users/${nome}`)
            .send(fieldPatch)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(204)
            });
            done();
        });
    });

    describe('Testes de exclusão de usuários do repositório', () => {
        it('deveria excluir o usuario raupp', function (done) {
            chai.request(app)
            .delete('/users/raupp')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.jsonSchema(userSchema);
                done();
            });
        });
    
        it('o usuario raupp não deve existir mais no sistema', function (done) {
            chai.request(app)
            .get('/users/raupp')
            .end(function (err, res) {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.jsonSchema(userSchema);
                done();
            });
        });
    });
    
})