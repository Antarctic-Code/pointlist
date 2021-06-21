const Sequelize = require("sequelize");
const db = require("../config/db");


const Place = db.define('place', {
    id : {
        type : Sequelize.UUID,
        primaryKey: true,
        allowNull: false
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
    descripcion : {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una descripcion'
            }
        }
    },
    fecha : {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una Fecha'
            }
        }
    },
    hora : {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Coloca una hora'
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



module.exports = Place;