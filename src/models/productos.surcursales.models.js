const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductosSurcursalesSchema = Schema({
  idSurcursal: { type: Schema.Types.ObjectId, ref: "Sucursales" },
  NombreProductoSucursal: String,
  StockSurcursal: Number,
  CantidadVendida: Number
});

module.exports = mongoose.model("ProductosSurcursales", ProductosSurcursalesSchema);
