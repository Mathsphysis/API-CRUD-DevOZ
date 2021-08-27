//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
const PORT = process.env.PORT || 3000;

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const Router = require('koa-router');

const koa = new Koa();

koa.use(async (ctx, next) => {
  try{
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

koa.use(bodyParser());

var router = new Router();

let usersDB = [];

//rota simples pra testar se o servidor está online
router.get('/', async (ctx) => {
  ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`; //http://localhost:3000/
});

//Uma rota de exemplo simples aqui.
//As rotas devem ficar em arquivos separados, /src/controllers/userController.js por exemplo
router.get('/users', async (ctx) => {
    ctx.status = 200;
    ctx.body = { total:usersDB.length, count: 0, rows: usersDB };
});

router.get('/users/:id', async (ctx) => {
    const { id } = ctx.params;
    const user = usersDB.filter((user) => user.nome === id);
    
    if(user.length === 0) {
      ctx.throw(404, 'User not found');
    }

    ctx.response.status = 200;
    ctx.body = user;
});

router.post('/users', async (ctx) => {
  const user = { ...ctx.request.body };
  usersDB.push(user);
  ctx.response.status = 201;
  ctx.body = user;
});

router.put('/users/:id', async (ctx) => {
  const userToUpdate = { ...ctx.request.body };
  usersDB[0] = userToUpdate;
  ctx.response.status = 204;
});

router.patch('/users/:id', async (ctx) => {
  const { op, path, value } = ctx.request.body;
  const { id } = ctx.params;
  const field = path.substring(1);
  usersDB.filter((user) => user.nome === id)
  .forEach((userToUpdate) => {
    userToUpdate[field] = value;
  });
  ctx.response.status = 204;
});

router.delete('/users/:id', async (ctx) => {
  const { id } = ctx.params;
  usersDB.splice(usersDB.indexOf(id), 1);
  ctx.response.status = 204;
});

koa
  .use(router.routes())
  .use(router.allowedMethods());

const server = koa.listen(PORT);

module.exports = server;