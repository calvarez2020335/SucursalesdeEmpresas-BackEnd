const express = require('express')
const controladorSurcusales = require('../controllers/sucursales.controller')

//Middleware
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarSucursales', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.agregarSucursales);
api.delete('/eliminarSucursales/:idSucursal', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.eliminarSucursales)

module.exports = api;