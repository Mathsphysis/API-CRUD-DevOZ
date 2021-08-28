const UserRepository = require('./repository');

module.exports.findAll = async function findAll(ctx) {
    const users = await UserRepository.findAll();
    ctx.status = 200;
    ctx.body = { total: users.length, count: 0, rows: users };
}