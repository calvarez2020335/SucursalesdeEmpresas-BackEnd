const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');

//Middleware

const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/login', usuarioControlador.Login)
api.post('/registrarEmpresa',[md_autenticacion.Auth, md_roles.verAdministrador] ,usuarioControlador.RegistrarEmpresa)
api.put('/editarEmpresa/:idUser', md_autenticacion.Auth ,usuarioControlador.EditarEmpresa)
api.delete('/eliminarEmpresa/:idUser', md_autenticacion.Auth , usuarioControlador.EliminarEmpresas);

module.exports = api;