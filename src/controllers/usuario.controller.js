const Usuario = require("../models/usuario.model");
const Surcursal = require("../models/sucursales.model")
const ProductosEmpresas = require("../models/productos.empresas.model");
const ProductoSurcursales = require("../models/productos.surcursales.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");

function registrarAdmin() {
  var modeloUsuario = new Usuario();

  Usuario.find({ email: "SuperAdmin" }, (err, usuarioEncontrado) => {
    if (usuarioEncontrado.length > 0) {
      return console.log("el SuperAdmin Ya Esta Registrado");
    } else {
      modeloUsuario.nombre = "SuperAdmin";
      modeloUsuario.email = "SuperAdmin";
      modeloUsuario.rol = "ROL_ADMIN";

      bcrypt.hash("123456", null, null, (err, passwordEncriptada) => {
        modeloUsuario.password = passwordEncriptada;

        modeloUsuario.save((err, usuarioGuardado) => {
          if (err) return console.log("Error en la peticion");
          if (!usuarioGuardado) return console.log("Error al registrar Admin");

          return console.log("SuperAdmin:" + " " + usuarioGuardado);
        });
      });
    }
  });
}

function Login(req, res) {
  var parametros = req.body;
  Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
    if (usuarioEncontrado) {
      // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
      bcrypt.compare(
        parametros.password,
        usuarioEncontrado.password,
        (err, verificacionPassword) => {
          //TRUE OR FALSE
          // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
          if (verificacionPassword) {
            // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
            if (parametros.obtenerToken === "true") {
              return res
                .status(200)
                .send({ token: jwt.crearToken(usuarioEncontrado) });
            } else {
              usuarioEncontrado.password = undefined;
              return res.status(200).send({ usuario: usuarioEncontrado });
            }
          } else {
            return res
              .status(500)
              .send({ mensaje: "Las contrasena no coincide" });
          }
        }
      );
    } else {
      return res
        .status(500)
        .send({ mensaje: "Error, el correo no se encuentra registrado." });
    }
  });
}

function RegistrarEmpresa(req, res) {
  var parametro = req.body;
  var usuarioModel = new Usuario();

  if (
    parametro.nombre &&
    parametro.email &&
    parametro.password &&
    parametro.tipoEmpresa
  ) {
    usuarioModel.nombre = parametro.nombre;
    usuarioModel.email = parametro.email;
    usuarioModel.telefono = parametro.telefono;
    usuarioModel.direccion = parametro.direccion;
    usuarioModel.password = parametro.password;
    usuarioModel.rol = "ROL_EMPRESA";
    usuarioModel.tipoEmpresa = parametro.tipoEmpresa;

    Usuario.find({ email: parametro.email }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length == 0) {
        bcrypt.hash(
          parametro.password,
          null,
          null,
          (err, passwordEncriptada) => {
            usuarioModel.password = passwordEncriptada;

            usuarioModel.save((err, usuarioGuardado) => {
              if (err)
                return res
                  .status(500)
                  .send({ mensaje: "Error en la peticion" });
              if (!usuarioGuardado)
                return res
                  .status(500)
                  .send({ mensaje: "Error al agregar Empresa" });

              return res.status(200).send({ usuario: usuarioGuardado });
            });
          }
        );
      } else {
        return res.status(500).send({ mensaje: "La empresa ya a sido creada" });
      }
    });
  } else {
    return res.status(500).send({ mensaje: "Enviar parametros obligatorios" });
  }
}

function EditarEmpresa(req, res) {
  var idUser = req.params.idUser;
  var parametros = req.body;

  Usuario.findOne({ idUser: idUser }, (err, usuarioEncontrado) => {
    if (req.user.rol == "ROL_ADMIN") {
      if (usuarioEncontrado.rol !== "ROL_EMPRESA") {
        return res
          .status(500)
          .send({ mensaje: "No puede editar a otros administradores" });
      } else {
        Usuario.findByIdAndUpdate(
          idUser,
          {
            $set: {
              nombre: parametros.nombre,
              telefono: parametros.telefono,
              direccion: parametros.direccion,
              tipoEmpresa: parametros.tipoEmpresa,
            },
          },
          { new: true },
          (err, usuarioActualizado) => {
            if (err)
              return res
                .status(500)
                .send({ mensaje: "Error en la peticon de editar-admin" });
            if (!usuarioActualizado)
              return res
                .status(500)
                .send({ mensaje: "Error al editar usuario-admin" });
            return res.status(200).send({ usuario: usuarioActualizado });
          }
        );
      }
    } else {
      Usuario.findByIdAndUpdate(
        req.user.sub,
        {
          $set: {
            nombre: parametros.nombre,
            telefono: parametros.telefono,
            direccion: parametros.direccion,
            tipoEmpresa: parametros.tipoEmpresa,
          },
        },
        { new: true },
        (err, usuarioActualizado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!usuarioActualizado)
            return res
              .status(500)
              .send({ mensaje: "Error al editar el Usuario" });

          return res.status(200).send({ usuario: usuarioActualizado });
        }
      );
    }
  });
}

//Falta este tambien
function EliminarEmpresas(req, res) {
  var idUsua = req.params.idUser;

  


  Surcursal.find({idEmpresa: idUsua} , (err , busqueda) =>{
      if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
      if (!busqueda)
         return res.status(500).send({ mensaje: "Error al eliminar el producto" });



      for (let i = 0; i < busqueda.length; i++) {
     

        ProductoSurcursales.deleteMany({idSurcursal: busqueda[i]._id} ,(err, busqueda1) => {
          if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!busqueda1)
             return res.status(500).send({ mensaje: "Error al eliminar el producto" });
          console.log(busqueda1);
        })
        

        
      }


      Surcursal.deleteMany({idEmpresa: idUsua } , (err, SucursalEliminada) =>{

        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!SucursalEliminada)
           return res.status(500).send({ mensaje: "Error al eliminar el producto" });

    console.log({ SucursalEliminada: SucursalEliminada});
      } )

      ProductosEmpresas.deleteMany({idEmpresa: idUsua}, (err, productoEliminado)=>{

        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!productoEliminado)
           return res.status(500).send({ mensaje: "Error al eliminar el producto" });

          console.log({ productoEliminado: productoEliminado})
      })

      Usuario.deleteOne({_id: idUsua} , (err, EmpresaEliminada) =>{

        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!EmpresaEliminada)
           return res.status(500).send({ mensaje: "Error al eliminar el producto" });

          return res.status(200).send({ EmpresaEliminada: EmpresaEliminada})

      })


    });  

}

function VerEmpresas(req, res) {
  Usuario.findOne({ _id: req.user.rol }, (err, usuarioEncontrado) => {
    if (req.user.rol == "ROL_ADMIN") {
      Usuario.find({}, (err, UsuarioEncontrado) => {
        return res.status(200).send({ Empresas: UsuarioEncontrado });
      });
    } else {
      Usuario.find({_id: req.user.rol}, (err, UsuarioEncontrado) =>{
        return res.status(200).send({mensaje: UsuarioEncontrado});
      })
    }
  });
}

function EmpresaId(req, res) {
  const idUser = req.params.idUser;

  Usuario.findById(
    { _id: idUser, idEmpresa: req.user.sub },
    (err, EmpresaEncontrada) => {
       
        if (err)
          return res.status(404).send({ mensaje: "Empresa no encontrado" });
        if (!EmpresaEncontrada)
          return res.status(404).send({ mensaje: "Empresa no encontrado" });
        return res.status(200).send({ Empresa: EmpresaEncontrada });
      
    }
  );
}

//Productos

function agregarProductosEmpresas(req, res) {
  var parametro = req.body;
  var productosEmpresasModel = new ProductosEmpresas();

  if (
    parametro.NombreProducto &&
    parametro.NombreProveedor &&
    parametro.Stock
  ) {
    productosEmpresasModel.idEmpresa = req.user.sub;
    productosEmpresasModel.NombreProducto = parametro.NombreProducto;
    productosEmpresasModel.NombreProveedor = parametro.NombreProveedor;
    productosEmpresasModel.Stock = parametro.Stock;

    ProductosEmpresas.find(
      { NombreProducto: parametro.NombreProducto, idEmpresa: req.user.sub },
      (err, productoEncontrado) => {
        if (productoEncontrado.length == 0) {
          productosEmpresasModel.save((err, productoGuardado) => {
            if (err)
              return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productoGuardado)
              return res
                .status(500)
                .send({ mensaje: "Error al agregar el producto" });
            return res.status(200).send({ productos: productoGuardado });
          });
        } else {
          return res
            .status(500)
            .send({ Surcusal: "El producto ya a sido creada" });
        }
      }
    );
  } else {
    return res
      .status(406)
      .send({ mensaje: "Debe enviar los parametro obligatorios" });
  }
}

//Tambien aqui
function VerProductos(req, res) {
  ProductosEmpresas.find(
    { idEmpresa: req.user.sub },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  );
}

function VerProductosId(req, res) {
  const idProducto = req.params.idProducto;

  ProductosEmpresas.findById(
    { _id: idProducto, idEmpresa: req.user.sub },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  );
}

function EliminarProductosEmpresas(req, res) {
  const productoEmpresaId = req.params.idProductoEmpresa;

  ProductosEmpresas.findOne(
    { _id: productoEmpresaId, idEmpresa: req.user.sub },
    (err, productoEmpresa) => {
      if (!productoEmpresa)
        return res
          .status(400)
          .send({ mensaje: "No puede eliminar productos de otras empresas" });

      ProductosEmpresas.findByIdAndDelete(
        productoEmpresaId,
        (err, productoEmpresaEliminado) => {
          if (err)
            return res.status(500).send({ mensaje: "Error en la peticion" });
          if (!productoEmpresaEliminado)
            return res
              .status(403)
              .send({ mensaje: "Error al eliminar el producto" });
          return res
            .status(200)
            .send({ productoEliminado: productoEmpresaEliminado });
        }
      );
    }
  );
}

function EditarProductoEmpresa(req, res) {
  const productoEmpresaId = req.params.idProductoEmpresa;
  const parametros = req.body;

  if (
    parametros.NombreProducto &&
    parametros.NombreProveedor &&
    parametros.Stock
  ) {
    ProductosEmpresas.findOne(
      { _id: productoEmpresaId, idEmpresa: req.user.sub },
      (err, productoEmpresa) => {
        if (!productoEmpresa)
          return res
            .status(400)
            .send({ mensaje: "No puede editar productos de otras empresas" });

        ProductosEmpresas.findByIdAndUpdate(
          productoEmpresaId,
          parametros,
          { new: true },
          (err, productoEmpresaEditado) => {
            if (err)
              return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!productoEmpresaEditado)
              return res.status(404).send({ mensaje: "Error al editar" });
            return res
              .status(200)
              .send({ productoEditado: productoEmpresaEditado });
          }
        );
      }
    );
  } else {
    return res
      .status(404)
      .send({ mensaje: "Debe enviar parametros obligatorios" });
  }
}

function OrdenarStockMayor(req, res) {
  ProductosEmpresas.find(
    { idEmpresa: req.user.sub },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  ).sort({ Stock: -1 });
}

function OrdenarStockMenor(req, res) {
  ProductosEmpresas.find(
    { idEmpresa: req.user.sub },
    (err, productoEncontrado) => {
      if (err)
        return res.status(404).send({ mensaje: "Producto no encontrado" });
      return res.status(200).send({ Productos: productoEncontrado });
    }
  ).sort({ Stock: 1 });
}




module.exports = {
  registrarAdmin,
  Login,
  RegistrarEmpresa,
  EditarEmpresa,
  EliminarEmpresas,
  VerEmpresas,
  EmpresaId,
  agregarProductosEmpresas,
  VerProductos,
  EliminarProductosEmpresas,
  EditarProductoEmpresa,
  VerProductosId,
  OrdenarStockMayor,
  OrdenarStockMenor,
};
