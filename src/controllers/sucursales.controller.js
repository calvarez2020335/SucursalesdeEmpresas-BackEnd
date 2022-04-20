const Sucursales = require("../models/sucursales.model");
const ProductoSurcursales = require("../models/productos.surcursales.models");
const ProductosEmpresas = require("../models/productos.empresas.model");


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
      { nombre: parametros.nombre, idEmpresa: req.user.sub },
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

  Sucursales.findOne(
    { _id: sucursalesid, idEmpresa: req.user.sub },
    (err, sucursalEmpresa) => {
      if (!sucursalEmpresa) {
        return res
          .status(401)
          .send({ mensaje: "No puede eliminar Sucursales de otras empresas" });
      }

      Sucursales.findByIdAndDelete(
        sucursalesid,
        (err, sucursalEmpresaEliminado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!sucursalEmpresaEliminado)
            return res
              .status(500)
              .send({ mensaje: "Error al eliminar al Sucursales" });

          return res.status(200).send({ Sucursal: sucursalEmpresaEliminado });
        }
      );
    }
  );
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

function verSucursalesEmpresas(req, res) {

  Sucursales.find({ idEmpresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {
    return res.status(200).send({ Sucursales: sucursalEmpresaEncontrada })
  })

}



function agregarProductosSurcursales(req, res) {
  const parametros = req.body;
  const modeloProductosSurcursales= new ProductoSurcursales();

  if (
    parametros.NombreProducto && parametros.nombreSurcursal && parametros.StockEnviar
  ) {

  Sucursales.findOne({nombre: parametros.nombreSurcursal ,  idEmpresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {
    if (!sucursalEmpresaEncontrada) return res.status(404).send({ mensaje: "surcursal no encontrada" });
    if (err) return res.status(404).send({ mensaje: "surcursal no encontrada" });
    // return res.status(200).send({ Sucursales: sucursalEmpresaEncontrada })

    ProductosEmpresas.findOne({ NombreProducto: parametros.NombreProducto , idEmpresa: req.user.sub }, (err, productoEncontrado) => {
      if (!productoEncontrado) return res.status(404).send({ mensaje: "Producto no encontrado" });
        if (err) return res.status(404).send({ mensaje: "Producto no encontrado" });
       // return res.status(200).send({ Productos: productoEncontrado, surcursales: sucursalEmpresaEncontrada });

      //  Sucursales.findOne({nombre: parametros.nombreSurcursal ,  idEmpresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {
      //   if (!sucursalEmpresaEncontrada) return res.status(404).send({ mensaje: "surcursal no encontrada" });
      //   if (err) return res.status(404).send({ mensaje: "surcursal no encontrada" });})

        modeloProductosSurcursales.idSurcursal = sucursalEmpresaEncontrada.id;
        modeloProductosSurcursales.NombreProductoSucursal = parametros.NombreProducto
        modeloProductosSurcursales.StockSurcursal = parametros.StockEnviar
        modeloProductosSurcursales.CantidadVendida = 0
 
 
        modeloProductosSurcursales.save((err, SurcursalGuardada) => {
           if (err)
             return res.status(500).send({ mensaje: "Error en la peticion" });
           if (!SurcursalGuardada)
             return res
               .status(500)
               .send({ mensaje: "Error al agregar Surcusal" });
 
           return res.status(200).send({ Surcusal: SurcursalGuardada });
         });

  
       

    }
  );


})

}else{
  return res.status(500).send({ Surcusal: "enviar parametros obligatorios" });
}

 
}


module.exports = {
  agregarSucursales,

  eliminarSucursales,

  editarSurcursal,


  verSucursalesEmpresas,
  agregarProductosSurcursales


};
