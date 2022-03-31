const express = require('express')
const controladorEmpleados = require('../controllers/empleado.controller')

//Middleware
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/registrarEmpleado', [md_autenticacion.Auth, md_roles.verEmpresas], controladorEmpleados.agregarEmpleado);
api.get('/Empleados', [md_autenticacion.Auth, md_roles.verEmpresas], controladorEmpleados.buscarTodosLosEmpleados)

module.exports = api;