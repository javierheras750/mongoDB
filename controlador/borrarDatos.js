var express = require('express');
var router = express.Router();
var Servicio = require('../servicio/servicio');
var Usuario = require('../modelo/usuario');
var Cuenta = require('../modelo/cuentaBancaria');
router.get('/', function(req, res, next) {
res.render('borrarDatos', { title: 'Bienvenido a BorrarDatos' });
});
router.post('/', function(req, res, next) {
    var dni= req.body.dni;
    var servicio = new Servicio();    
    servicio.borrarUsuario(dni,function(err,mensaje){    
        if (err){
            res.render('error',{mensaje : mensaje});
        }else {
            res.render('index', { mensaje : mensaje });   
        }        
    }); 
});

module.exports = router;