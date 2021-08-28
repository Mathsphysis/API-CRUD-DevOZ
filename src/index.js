//Voce deve rodar os testes usando:  npm test
//Para testar a aplicação, rode: npm run dev

//mais infos
//https://github.com/ZijianHe/koa-router

// todas as configuraçoes devem ser passadas via environment variables
const PORT = process.env.PORT || 3000;

const Koa = require('koa');

const bodyParser = require('koa-bodyparser');

const router = require('./controller/controllers');

const koa = new Koa();

koa.use(async (ctx, next) => {
  try{
    await next();
  } catch (err) {
    ctx.app.emit('error', err, ctx);
  }
});

koa.use(bodyParser());

koa
  .use(router.routes())
  .use(router.allowedMethods());

koa.on('error', (err, ctx) => {
  ctx.response.status = err.status || 500;
  ctx.body = err.message;
});

const server = koa.listen(PORT);

module.exports = server;