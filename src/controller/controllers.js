const Router = require("koa-router");

const UserService = require('../service/service');
const ErrorFactory = require("../exception/ErrorFactory");

const repo = process.env.REPO;

const httpStatusCode = require('../utils/httpStatusCode');

const UserRepository = require(`../repository/${repo}`);




const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const errorFactory = new ErrorFactory();

let router = new Router({
    prefix: '/api/v1'
});

//rota simples pra testar se o servidor está online
router.get("/", async (ctx) => {
  const healthCheck = { message: `O servidor está rodando!` };
  ctx.body = healthCheck;
});

router.get("/users", async (ctx) => {
  const queryPage = ctx.request.query.page;
  const queryLimit = ctx.request.query.limit;
  try {
    const usersPage = await userService.findAll(queryPage, queryLimit);
    ctx.status = httpStatusCode.OK;
    ctx.body = { 
      total: usersPage.count, 
      currentPageUsersCount: usersPage.rows.length, 
      rows: usersPage.rows, 
      totalPages: usersPage.totalPages, 
      currentPage: usersPage.currentPage 
    };
  } catch (err) {
    throw err;
  }
});

router.get("/users/:id", async (ctx) => {
  const { id } = ctx.params;
    try {
        const user = await userService.findOneByName(id);
        ctx.response.status = httpStatusCode.OK;
        ctx.body = user;
    } catch (err) {
      throw err;
    }
});

router.post("/users", async (ctx) => {
  const userToSave = { ...ctx.request.body };
  try {
    const user = await userService.save(userToSave);
    ctx.response.status = httpStatusCode.CREATED;
    ctx.body = user;
  } catch (err) {
    throw err;
  }
});

router.put("/users/:id", async (ctx) => {
  const userToUpdate = { ...ctx.request.body };
  const { id } = ctx.params;
  try {
    await userService.updateByName(id, userToUpdate);
    ctx.response.status = httpStatusCode.NO_CONTENT;
  } catch (err) {
    throw err;
  }
});

router.patch("/users/:id", async (ctx) => {
  const { op, path, value } = ctx.request.body;
  const { id } = ctx.params;
  const FIELD_NAME_START_INDEX = 1;
  const field = path.substring(FIELD_NAME_START_INDEX);
  const requestedOp = acceptedOps[op];
  if(requestedOp === undefined){
    return await invalidOperationRequestedError(op);
  }
  try {
    await requestedOp(id, field, value);
    return ctx.response.status = httpStatusCode.NO_CONTENT;
  } catch (err) {
    throw err;
  }
});

router.delete("/users/:id", async (ctx) => {
  const { id } = ctx.params;
  try {
    await userService.deleteByName(id);
    ctx.response.status = httpStatusCode.NO_CONTENT;
  } catch (err) {
    throw err;
  }
});

const acceptedOps = {
  async replace(name, field, value) {
    await userService.replaceField(name,field,value);
  }
}

async function invalidOperationRequestedError(op) {
  const err = {
    name: 'Invalid Operation Requested Error',
    op: op
  }
  return await errorFactory.getError(err, 'InvalidOperationRequestedError');
}

module.exports = router;