const Sucursales = require("../models/sucursales.model");

function agregarSucursales(req, res) {

  const parametros = req.body;
  const modeloSucursales = new Sucursales();

  if(parametros.nombre && parametros.telefono && parametros.stock && parametros.direccion){

    modeloSucursales.nombre = parametros.nombre;
    modeloSucursales.telefono = parametros.telefono;
    modeloSucursales.direccion = parametros.direccion;
    modeloSucursales.stock = parametros.stock;
    modeloSucursales.vendido = parametros.vendido;
    modeloSucursales.idEmpresa = req.user.sub;

  }

}