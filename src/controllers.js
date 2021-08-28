const Router = require("koa-router");

const UserService = require('./service');
const UserRepository = require('./repository');

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
  try {
    const users = await userService.findAll(ctx);
    ctx.status = 200;
    ctx.body = { total: users.length, count: 0, rows: users };
  } catch (err) {
    ctx.throw(500);
  }
});

router.get("/users/:id", async (ctx) => {
  const { id } = ctx.params;
    try {
        const user = await userService.findOneByID(id);
        ctx.response.status = 200;
        ctx.body = user;
    } catch (err) {
        ctx.throw(404, err.message);
    }
});

router.post("/users", async (ctx) => {
  const userToSave = { ...ctx.request.body };
  try {
    const user = await userService.save(userToSave);
    ctx.response.status = 201;
    ctx.body = user;
  } catch (err) {
    ctx.throw(400, err.message);
  }
});

router.put("/users/:id", async (ctx) => {
  const userToUpdate = { ...ctx.request.body };
  const { id } = ctx.params;
  try {
    await userService.update(id, userToUpdate);
  } catch (err) {
    ctx.throw(404, err.message);
  }
  ctx.response.status = 204;
});

router.patch("/users/:id", async (ctx) => {
  const { op, path, value } = ctx.request.body;
  const { id } = ctx.params;
  const field = path.substring(1);
  const requestedOp = acceptedOps[op];
  if(requestedOp !== undefined){
    try {
      await requestedOp(id, field, value);
      ctx.response.status = 204;
    } catch (err) {
      ctx.throw(404, err.message);
    }
  }
});

router.delete("/users/:id", async (ctx) => {
  const { id } = ctx.params;
  try {
    await userService.deleteByID(id);
    ctx.response.status = 204;
  } catch (err) {
    ctx.throw(404, err.message);
  }
});

const acceptedOps = {
  async replace(id, field, value) {
    await userService.replaceField(id,field,value);
  }
}

module.exports = router;