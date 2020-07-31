var mongoose = require('mongoose');
var esquema = mongoose.Schema;  
var descripcionUsuario = {
  dni: String,
  nombre: String,
  primerApellido: String,
  segundoApellido: String,
}
var schemaUsuario = new esquema(descripcionUsuario);
module.exports=mongoose.model('usuario', schemaUsuario);