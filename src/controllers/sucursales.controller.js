const Sucursales = require("../models/sucursales.model");

function agregarSucursales(req, res) {
  const parametros = req.body;
  const modeloSucursales = new Sucursales();

  if (
    parametros.nombre &&
    parametros.telefono &&
    parametros.stock &&
    parametros.direccion
  ) {
    modeloSucursales.nombre = parametros.nombre;
    modeloSucursales.telefono = parametros.telefono;
    modeloSucursales.direccion = parametros.direccion;
    modeloSucursales.stock = parametros.stock;
    modeloSucursales.vendido = 0;
    modeloSucursales.idEmpresa = req.user.sub;

    Sucursales.find({ nombre: parametros.nombre }, (err, sucursalEmcontrada) => {
      if (sucursalEmcontrada.length == 0) {
        modeloSucursales.save((err, SurcursalGuardada) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!SurcursalGuardada)
            return res
              .status(500)
              .send({ mensaje: "Error al agregar Surcusal" });

          return res.status(200).send({ Surcusal: SurcursalGuardada });
        });
      } else {
        return res.status(500).send({ Surcusal: "La Sucursal ya a sido creada" });
      }
    });
  } else {
    return res.status(500).send({ Surcusal: "enviar parametros obligatorios" });
  }
}




module.exports = {
  agregarSucursales,
};
