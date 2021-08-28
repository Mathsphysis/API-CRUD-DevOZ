const UserRepository = require('./repository');

async function findAll(ctx) {
    const users = await UserRepository.findAll();
    ctx.status = 200;
    ctx.body = { total: usersDB.length, count: 0, rows: usersDB };
}