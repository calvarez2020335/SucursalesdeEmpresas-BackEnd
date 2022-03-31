const express = require('express');
const cors = require('cors');
const app = express();

// IMPORTACION RUTAS

const usuarioRutas = require('./src/routes/usuario.routes')
const empleadosRutas = require('./src/routes/empleados.routes')

// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/productos

app.use('/api' , usuarioRutas, empleadosRutas);

module.exports = app;