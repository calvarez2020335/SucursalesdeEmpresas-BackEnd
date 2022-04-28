const Sucursales = require("../models/sucursales.model");
const ProductoSurcursales = require("../models/productos.surcursales.model");
const ProductosEmpresas = require("../models/productos.empresas.model");

function agregarSucursales(req, res) {
  const parametros = req.body;
  const modeloSucursales = new Sucursales();

  if (
    parametros.nombre &&
    parametros.telefono &&
    parametros.direccion
  ) {
    modeloSucursales.nombre = parametros.nombre;
    modeloSucursales.telefono = parametros.telefono;
    modeloSucursales.direccion = parametros.direccion;
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
//Buscar todas las sucursales

function verSucursalesEmpresas(req, res) {

  Sucursales.find({ idEmpresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {
    return res.status(200).send({ Sucursales: sucursalEmpresaEncontrada })
  })

}

//Se usa para poder editar la sucursal
function verSucursalesId(req, res) {

  const idSucursal = req.params.idSucursal;
  Sucursales.findById({ _id: idSucursal, idEmpresa: req.user.sub }, (err, sucursalId) => {
    return res.status(200).send({ Sucursal: sucursalId });
  })

}

//Produtos Por Sucursales ---------------------------------------------------------------------

function agregarProductosSurcursales(req, res) {
  const parametros = req.body;
  const modeloProductosSurcursales = new ProductoSurcursales();

  if (
    parametros.NombreProducto && parametros.nombreSurcursal && parametros.StockEnviar
  ) {

    Sucursales.findOne({ nombre: parametros.nombreSurcursal, idEmpresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {
      if (!sucursalEmpresaEncontrada) return res.status(404).send({ mensaje: "surcursal no encontrada" });
      if (err) return res.status(404).send({ mensaje: "surcursal no encontrada" });

      ProductosEmpresas.findOne({ NombreProducto: parametros.NombreProducto, idEmpresa: req.user.sub }, (err, productoEncontrado) => {
        if (!productoEncontrado) return res.status(404).send({ mensaje: "Producto no encontrado empresas" });
        if (err) return res.status(404).send({ mensaje: "Producto no encontrado" });


        ProductoSurcursales.findOne({ NombreProductoSucursal: parametros.NombreProducto, idSurcursal: sucursalEmpresaEncontrada.id }, (err, ProductoSurcursalesEncontrada) => {
          if (err) return res.status(404).send({ mensaje: "producto no encontrada surcursales" });

          if (parametros.StockEnviar <= 0) {
            return res.status(404).send({ mensaje: "formato incorrecto" });
          }

          if (parametros.StockEnviar > productoEncontrado.Stock) {
            return res.status(404).send({ mensaje: "no hay stock " });
          }

          const data = {
            Stock: productoEncontrado.Stock,
          }
          data.Stock = productoEncontrado.Stock - parametros.StockEnviar

          if (ProductoSurcursalesEncontrada == null) {

            modeloProductosSurcursales.idSurcursal = sucursalEmpresaEncontrada.id;
            modeloProductosSurcursales.NombreProductoSucursal = parametros.NombreProducto
            modeloProductosSurcursales.StockSurcursal = parametros.StockEnviar
            modeloProductosSurcursales.CantidadVendida = 0

            modeloProductosSurcursales.save((err, SurcursalGuardada) => {
              ProductosEmpresas.findOneAndUpdate({ _id: productoEncontrado.id }, data, { new: true }, (err, ActualizarStockEmpresa) => {
              })
              if (err)
                return res.status(500).send({ mensaje: "Error en la peticion" });
              if (!SurcursalGuardada)
                return res
                  .status(500)
                  .send({ mensaje: "Error al agregar Surcusal" });

              return res.status(200).send({ Surcusal: SurcursalGuardada });
            });
          } else {

            ProductoSurcursales.findByIdAndUpdate({ _id: ProductoSurcursalesEncontrada.id }, { $inc: { StockSurcursal: parametros.StockEnviar } }, { new: true }, (err, StockModificado) => {
              ProductosEmpresas.findOneAndUpdate({ _id: productoEncontrado.id }, data, { new: true }, (err, ActualizarStockEmpresa) => {
              })
              if (!StockModificado) return res.status(404).send({ mensaje: "Producto no encontrado" });
              if (err) return res.status(404).send({ mensaje: "Producto no encontrado" });

              return res.status(404).send({ productoafectado: StockModificado });
            })
          }
        })
      });
    })

  } else {
    return res.status(500).send({ Surcusal: "enviar parametros obligatorios" });
  }

}

function VerProductosPorSucursales(req, res) {
  var idSurcursal = req.params.idSurcursal;
  ProductoSurcursales.find(
    {idSurcursal: idSurcursal ,idEmpresa: req.user.sub },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  )
}

function VentaSimuladaSurcursales(req, res) {
  const parametros = req.body;
  const idSurcu = req.params.idSurcursal

  if (
    parametros.NombreProductoSurcur && parametros.StockVender
  ) {

    Sucursales.findOne({ _id: idSurcu, idEmpresa: req.user.sub }, (err, sucursalEmpresaEncontrada) => {
      if (!sucursalEmpresaEncontrada) return res.status(404).send({ mensaje: "surcursal no encontrada" });
      if (err) return res.status(404).send({ mensaje: "surcursal no encontrada" });

      ProductoSurcursales.findOne({ NombreProductoSucursal: parametros.NombreProductoSurcur, idSurcursal: sucursalEmpresaEncontrada.id }, (err, ProductoSurcursalesEncontrada) => {
        if (err) return res.status(404).send({ mensaje: "producto no encontrada surcursales" });

        if (parametros.StockVender <= 0) {
          return res.status(404).send({ mensaje: "formato incorrecto" });
        }

        if (parametros.StockVender > ProductoSurcursalesEncontrada.StockSurcursal) {
          return res.status(404).send({ mensaje: "no hay stock " });
        }

        const data = {
          StockSurcursal: ProductoSurcursalesEncontrada.StockSurcursal,
          CantidadVendida: ProductoSurcursalesEncontrada.CantidadVendida
        }
        data.StockSurcursal = ProductoSurcursalesEncontrada.StockSurcursal - parametros.StockVender
        data.CantidadVendida = parseFloat(data.CantidadVendida)  + parseFloat(parametros.StockVender) 

        if (ProductoSurcursalesEncontrada == null) {
          return res.status(404).send({ mensaje: "producto no encontrada en surcursales" });

        } else {

          ProductoSurcursales.findByIdAndUpdate({ _id: ProductoSurcursalesEncontrada.id }, data, { new: true }, (err, StockModificado) => {
            if (!StockModificado) return res.status(404).send({ mensaje: "Producto no encontrado" });
            if (err) return res.status(404).send({ mensaje: "Producto no encontrado" });

            return res.status(404).send({ productoafectado: StockModificado });
          })
        }
      })

    })

  } else {
    return res.status(500).send({ Surcusal: "enviar parametros obligatorios" });
  }

}

function OrdenarStockSurcursaleskMayor(req, res) {
  const idSurcu = req.params.idSurcursal

  ProductoSurcursales.find(
    { idSurcursal: idSurcu, idEmpresa: req.user.sub },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  ).sort({StockSurcursal: -1})

}

function OrdenarStockSurcursaleskMenor(req, res) {
  const idSurcu = req.params.idSurcursal
  ProductoSurcursales.find(
    { idSurcursal: idSurcu, idEmpresa: req.user.sub },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  ).sort({StockSurcursal: 1})

}

function ElMasVendidoProductos(req, res) {
  const idSurcu = req.params.idSurcursal
  ProductoSurcursales.find(
    {idSurcursal: idSurcu, idEmpresa: req.user.sub },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  ).sort({CantidadVendida: -1})

}
module.exports = {
  agregarSucursales,
  eliminarSucursales,
  editarSurcursal,
  verSucursalesId,
  verSucursalesEmpresas,

  agregarProductosSurcursales,
  VerProductosPorSucursales,
  VentaSimuladaSurcursales,
  OrdenarStockSurcursaleskMayor ,
  ElMasVendidoProductos,
  OrdenarStockSurcursaleskMenor


};
