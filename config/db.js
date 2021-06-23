const Sequelize = require("sequelize");
//Extrae datos de DB del .env
require("dotenv").config({ path: ".env" });
const logging = process.env.LOG_DB === "TRUE";
const dialectOptions = {}

if (process.env.DB_SSL === "TRUE") {
  
    dialectOptions.ssl= {
        require: true,
        rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
      }
}


const db = new Sequelize(process.env.BD_URL, {
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging,
  dialectOptions
});

module.exports = db;
