var mongoose = require('mongoose');
var usuarioSchema = require('./usuarioSchema');
var esquema = mongoose.Schema;
  var descripcionCuentaBancaria = {
    id: String,
    saldo: Number,
    dni : [{ type: esquema.Types.String , ref: usuarioSchema}] 
  }
  var schemaCuenta = new esquema(descripcionCuentaBancaria);
  module.exports=mongoose.model('cuenta', schemaCuenta);
 