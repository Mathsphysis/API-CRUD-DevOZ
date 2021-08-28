const Router = require("koa-router");

const UserService = require('./service');

let router = new Router({
    prefix: '/api/v1'
});



//rota simples pra testar se o servidor está online
router.get("/", async (ctx) => {
  ctx.body = `O servidor está rodando!`;
});

router.get("/users", async (ctx) => {
  return UserService.findAll(ctx);
});

router.get("/users/:id", async (ctx) => {
  const { id } = ctx.params;
  const user = usersDB.filter((user) => user.nome === id);

  if (user.length === 0) {
    ctx.throw(404, "User not found");
  }

  ctx.response.status = 200;
  ctx.body = user;
});

router.post("/users", async (ctx) => {
  const user = { ...ctx.request.body };
  usersDB.push(user);
  ctx.response.status = 201;
  ctx.body = user;
});

router.put("/users/:id", async (ctx) => {
  const userToUpdate = { ...ctx.request.body };
  usersDB[0] = userToUpdate;
  ctx.response.status = 204;
});

router.patch("/users/:id", async (ctx) => {
  const { op, path, value } = ctx.request.body;
  const { id } = ctx.params;
  const field = path.substring(1);
  usersDB
    .filter((user) => user.nome === id)
    .forEach((userToUpdate) => {
      userToUpdate[field] = value;
    });
  ctx.response.status = 204;
});

router.delete("/users/:id", async (ctx) => {
  const { id } = ctx.params;
  usersDB.splice(usersDB.indexOf(id), 1);
  ctx.response.status = 204;
});

module.exports = router;