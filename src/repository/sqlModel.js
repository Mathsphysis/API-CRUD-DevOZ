const Sequelize = require('sequelize');

const sequelize = require('../config/database');
const Regex = require('../config/regexValidators');

const { Model } = Sequelize;

class User extends Model {}

User.init(
    {
        nome: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                is: Regex.nameRegex
            }
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                is: Regex.emailRegex
            }
        },
        idade: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
                min: 18
            }
        }
    },
    {
        sequelize,
        modelName: 'user',
        timestamps: true
    }
)

module.exports = User;
