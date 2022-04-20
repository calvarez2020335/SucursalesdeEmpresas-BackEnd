const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductosEmpresasSchema = Schema({
  idEmpresa: { type: Schema.Types.ObjectId, ref: "Usuarios" },
  NombreProducto: String,
  NombreProveedor: String,
  Stock: Number
});

module.exports = mongoose.model("ProductosEmpresas", ProductosEmpresasSchema);
