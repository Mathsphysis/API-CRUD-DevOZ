const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const { Model } = Sequelize;

class User extends Model {}

User.init(
    {
        nome: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        idade: {
            type: Sequelize.INTEGER,
            validate: {
                min: 18
            }
        }
    },
    {
        sequelize,
        modelName: 'user'
    }
)

module.exports = User;
