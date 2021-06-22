
const express = require('express');
//const path = require('path');
const route = require('./routes');
require('dotenv').config({path: '.env'});
//const bodyParser = require('body-parser');


//conexion con la BD
const db = require("./config/db");

//Modelos
require("./models/Place");
require("./models/User");
/*
require("./models/Customer");
require("./models/NationalIdType");
require("./models/CustomerUser");
require("./models/Acount");
require("./models/AcountType");
require("./models/Bank");
require("./models/Currency");
require("./models/Fee");
require("./models/Rate");
require("./models/Group");
require("./models/BranchOffice");
require("./models/User");
require("./models/Transaction");
require("./models/Order");
require("./models/Occupation");
require("./models/Referred");
*/
db.sync()  //{ alter: true }
    .then(()=> console.log('DB conectada'))
    .catch((error)=>console.log(error));


//Dependencia para que la API responda desde otros origenes
const cors = require('cors');

//crear un app en express
const app = express();





//Se habilita el bodyParser para los req de datos
app.use(express.urlencoded({extended: true }));
app.use(express.json());


//Carpeta de archivos estaticos
// static files
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('uploads'));

//Definit Dominio Para recibir las peticiones 
const whiteLins = process.env.URL_FRONTEND.split(',');
const corsOprions = {
  origin: (origin, callback) => {
    //Verificoa que sea de un servidor de la lista blanca 
    const existe = whiteLins.some(dominio => dominio === origin);
    if(existe || !origin)  {
      callback(null, true);
    }
    else { 
      callback(new Error(`Dominio: ${origin} No Permitido`));
    }
  }
}
//Habilitar CORS
app.use(cors(corsOprions));




app.use('/',route());



const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8080';
app.listen(port, host, function () {
  console.log('Server running at http://' + host + ':' + port + '/'); 
});