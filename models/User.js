
const Sequelize = require("sequelize");
const db = require("../config/db");
const bcrypt = require('bcrypt');


const User = db.define('user', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user : {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'the user cannot be empty'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario Registrado'
        }
    },

    password : {
        type : Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'the password cannot be empty'
            }
        }
    },
}, {
    hooks: {
        beforeCreate (user) {
            user.password= bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        }
    }


});

User.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

User.prototype.hashPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports = User;