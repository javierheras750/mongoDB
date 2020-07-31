var DaoUsuario = require('../datosMongoDB/daoUsuario');
var Servicio = function(){  
    this.daoUsuario = new DaoUsuario(); 
}
Servicio.prototype.insertarUsuario = function(usuario,callback){  
      this.daoUsuario.insertarUsuario(usuario,function(err,mensaje){
         return callback(err,mensaje);              
     })
};
 
Servicio.prototype.mostrarDatos = function(callback){  
       this.daoUsuario.getUsuarios(function(err,mensaje,resultados){
        return callback(err,mensaje,resultados);              
   })
};

Servicio.prototype.borrarUsuario = function(dni,callback){  
    this.daoUsuario.borrarUsuario(dni,function(err,mensaje){
        return callback(err,mensaje);             
})
};

Servicio.prototype.modificarUsuario = function(usuario,callback){  
    this.daoUsuario.modificarUsuario(usuario,function(err,mensaje){
        return callback(err,mensaje);           
})
};

Servicio.prototype.getUsuario = function(dni,callback){     
       this.daoUsuario.getUsuario(dni,function(err,mensaje,resultado){
        return callback(err,mensaje,resultado);    
    })      
  } 
module.exports = Servicio;