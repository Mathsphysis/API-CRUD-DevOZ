const Router = require("koa-router");
const config = require('config');

const repoConfig = config.get('repository');

const UserService = require('../service/service');
const UserRepository = require(`../repository/${repoConfig.name}`);

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

let router = new Router({
    prefix: '/api/v1'
});

//rota simples pra testar se o servidor está online
router.get("/", async (ctx) => {
  ctx.body = `O servidor está rodando!`;
});

router.get("/users", async (ctx) => {
  let { page, limit } = ctx.request.query;
  limit = limit ? parseInt(limit) : 10;
  page = page ? parseInt(page) : 1;

  try {
    const usersPage = await userService.findAll(page, limit);
    ctx.status = 200;
    ctx.body = { 
      total: usersPage.count, 
      currentPageUsersCount: usersPage.rows.length, 
      rows: usersPage.rows, 
      totalPages: usersPage.totalPages, 
      currentPage: usersPage.currentPage 
    };
  } catch (err) {
    ctx.throw(500);
  }
});

router.get("/users/:id", async (ctx) => {
  const { id } = ctx.params;
    try {
        const user = await userService.findOneByName(id);
        ctx.response.status = 200;
        ctx.body = user;
    } catch (err) {
        ctx.throw(err.statusCode, err.message);
    }
});

router.post("/users", async (ctx) => {
  const userToSave = { ...ctx.request.body };
  try {
    const user = await userService.save(userToSave);
    ctx.response.status = 201;
    ctx.body = user;
  } catch (err) {
    ctx.throw( err.statusCode, err.message, { invalidFields: err.invalidFields });
  }
});

router.put("/users/:id", async (ctx) => {
  const userToUpdate = { ...ctx.request.body };
  const { id } = ctx.params;
  try {
    await userService.updateByName(id, userToUpdate);
    ctx.response.status = 204;
  } catch (err) {
    ctx.throw(err.statusCode, err.message);
  }
});

router.patch("/users/:id", async (ctx) => {
  const { op, path, value } = ctx.request.body;
  const { id } = ctx.params;
  const field = path.substring(1);
  const requestedOp = acceptedOps[op];
  if(requestedOp === undefined){
    return ctx.throw(400, `Invalid operation requested: ${op}`);
  }
  try {
    await requestedOp(id, field, value);
    return ctx.response.status = 204;
  } catch (err) {
    return ctx.throw(err.statusCode, err.message);
  }
});

router.delete("/users/:id", async (ctx) => {
  const { id } = ctx.params;
  try {
    await userService.deleteByName(id);
    ctx.response.status = 204;
  } catch (err) {
    ctx.throw(err.statusCode, err.message);
  }
});

const acceptedOps = {
  async replace(name, field, value) {
    await userService.replaceField(name,field,value);
  }
}

module.exports = router;