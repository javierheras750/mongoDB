var express = require('express');
var router = express.Router();
var Servicio = require('../servicio/servicio');
var Usuario = require('../modelo/usuario');
var Cuenta = require('../modelo/cuentaBancaria');

router.post('/', function(req, res, next) {    
   var servicio = new Servicio();
   //Recuperamos los parametros del formulario
   var dni = req.body.dni;
   var nombre = req.body.nombre;
   var primerApellido = req.body.primerApellido;
   var segundoApellido = req.body.segundoApellido;   
   var saldo = req.body.saldo;
   //Creamos un nuevo usuario
   var usuario = new Usuario();
   usuario.setDni(dni);
   usuario.setNombre(nombre);
   usuario.setPrimerApellido(primerApellido);
   usuario.setSegundoApellido(segundoApellido);
   //Creamos una nueva cuenta
   var cuenta = new Cuenta();
   cuenta.setId(dni);
   let saldoNumerico = Number(saldo);  
   cuenta.setSaldo(saldoNumerico); 
   //insertamos la cuenta en el usuario;
   usuario.setCuenta(cuenta);
   //Insertamos en la base de datos
   var servicio = new Servicio(); 
     servicio.modificarUsuario(usuario,function(err,mensaje){
       if (err){
         res.render('error',{mensaje : mensaje});
       }
       else {
        res.render('index', { mensaje : mensaje });   
       }
   });
});

module.exports = router;

