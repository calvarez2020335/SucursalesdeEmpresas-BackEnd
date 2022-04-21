const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SucursalesSchema = Schema({
  nombre: String,
  telefono: String,
  direccion: String,
  idEmpresa: { type: Schema.Types.ObjectId, ref: "Usuarios" },
});

module.exports = mongoose.model("Sucursales", SucursalesSchema);
