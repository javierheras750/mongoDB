var CuentaBancaria = require('./cuentaBancaria');
var Usuario = function(){
    var cuentaBancaria = new CuentaBancaria();
    this.dni='';
    this.nombre='';
    this.primerApellido='';
    this.segundoApellido='';
    this.cuenta= cuentaBancaria;
}
Usuario.prototype.setDni= function(dni){
    this.dni = dni;
}
Usuario.prototype.setNombre= function(nombre){
   this.nombre = nombre;
} 
Usuario.prototype.setPrimerApellido= function(primerApellido){
     this.primerApellido = primerApellido;
}
Usuario.prototype.setSegundoApellido= function(segundoApellido){
    this.segundoApellido = segundoApellido;
}
Usuario.prototype.setCuenta= function(cuenta){
    this.cuenta = cuenta;
}

Usuario.prototype.getDni= function(){
   return this.dni;
}
Usuario.prototype.getNombre= function(){
    return this.nombre;
}
Usuario.prototype.getPrimerApellido= function(){
    return this.primerApellido;
}
Usuario.prototype.getSegundoApellido= function(){
    return this.segundoApellido;
}
Usuario.prototype.getCuenta= function(){
   return this.cuenta;
}
Usuario.prototype.getJSON = function(){
    return {
       dni:this.dni,
       nombre:this.nombre,
       primerApellido:this.primerApellido,
       segundoApellido:this.segundoApellido,
       cuenta:this.cuenta
    }
}
module.exports = Usuario;