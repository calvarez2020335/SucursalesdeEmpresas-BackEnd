const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductosSurcursalesSchema = Schema({
  idSucursal: { type: Schema.Types.ObjectId, ref: "Sucursales" },
  NombreProductoSucursal: String,
  StockSurcursal: Number,
  CantidadVendida: Number
});

module.exports = mongoose.model("ProductosSurcursales", ProductosSurcursalesSchema);
