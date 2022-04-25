const express = require('express')
const controladorSurcusales = require('../controllers/sucursales.controller')

//Middleware
const md_autenticacion = require('../middlewares/autenticacion');
const md_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarSucursales', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.agregarSucursales);

api.delete('/eliminarSucursales/:idSucursal', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.eliminarSucursales)

api.put('/editarSurcursal/:idSurcursal', [md_autenticacion.Auth, md_roles.verEmpresas] ,controladorSurcusales.editarSurcursal)
api.get('/Sucursales', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.verSucursalesEmpresas)
api.get('/SucursalesId/:idSucursal', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.verSucursalesId)

//productos surcursales 
api.post('/EnviarProductosSurcursales', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.agregarProductosSurcursales)
api.get('/VerProductosPorSucursales/:idSurcursal', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.VerProductosPorSucursales)
api.put('/VentaSimuladaSurcursal/:idSurcursal', [md_autenticacion.Auth, md_roles.verEmpresas] ,controladorSurcusales.VentaSimuladaSurcursales)
api.get('/stockMasAlto/:idSurcursal', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.OrdenarStockSurcursaleskMayor)
api.get('/stockMasBajo/:idSurcursal', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.OrdenarStockSurcursaleskMenor)
api.get('/ElProductoMasVendido/:idSurcursal', [md_autenticacion.Auth, md_roles.verEmpresas], controladorSurcusales.ElMasVendidoProductos)

module.exports = api;