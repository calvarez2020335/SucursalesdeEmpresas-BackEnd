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

    Sucursales.find(
      { nombre: parametros.nombre , idEmpresa: req.user.sub},
      (err, sucursalEmcontrada) => {
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
          return res
            .status(500)
            .send({ Surcusal: "La Sucursal ya a sido creada" });
        }
      }
    );
  } else {
    return res.status(500).send({ Surcusal: "enviar parametros obligatorios" });
  }
}


function eliminarSucursales(req, res) {
  const sucursalesid = req.params.idSucursal;

  Sucursales.findOne({_id: sucursalesid, idEmpresa: req.user.sub}, (err, sucursalEmpresa)=>{

    if(!sucursalEmpresa){
      return res.status(401).send({mensaje: "No puede eliminar empleados de otras empresas"})
    }

    Sucursales.findByIdAndDelete(sucursalesid,(err, sucursalEmpresaEliminado)=>{
      if(err) return res.status(500).send({mensaje: "Error en la peticion"});
      if(!sucursalEmpresaEliminado) return res.status(500).send({mensaje: "Error al eliminar al empleado"})

      return res.status(200).send({Sucursal: sucursalEmpresaEliminado})
    })

  })

}

function editarSurcursal(req, res) {
  var idSurcursal = req.params.idSurcursal;
  var parametros = req.body;

  Sucursales.findOne(
    { _id: idSurcursal, _idEmpresa: req.user.sub },
    (err, SurcursalEnciontrada) => {
      if (!SurcursalEnciontrada) {
        return res
          .status(500)
          .send({ mensaje: "Esta Surcursal No Te Pertenece" });
      } else {
        Sucursales.findByIdAndUpdate(
          idSurcursal,
          parametros,
          { new: true },
          (err, SurcursalEditada) => {
            if (err)
              return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!SurcursalEditada)
              return res
                .status(403)
                .send({ mensaje: "Error al editar la Surcusal" });


            return res.status(200).send({ Surcusal: SurcursalEditada });
          }
        );
      }
    }
  );
}

module.exports = {
  agregarSucursales,

  eliminarSucursales,

  editarSurcursal,

};
