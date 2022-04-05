const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsuarioSchema = Schema({
  nombre: String,
  email: String,
  telefono: Number,
  direccion: String,
  password: String,
  rol: String,
  tipoEmpresa: String,
  ProductoEmpresa: [
    {
      nombreProducto: String,
      NombreProveedor: String,
      Stock: String,
    },
  ],
});

module.exports = mongoose.model("Usuarios", UsuarioSchema);
