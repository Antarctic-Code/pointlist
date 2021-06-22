const Sequelize = require("sequelize");
const db = require("../config/db");
const User = require("./User");


const Place = db.define('place', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo : {
        type : Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Agrega un titulo'
            }
        }
    },
    direccion : {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una direccion'
            }
        }
    },
    ubicacion : {
        type: Sequelize.GEOMETRY('POINT')
    }
});
Place.belongsTo(User);


module.exports = Place;