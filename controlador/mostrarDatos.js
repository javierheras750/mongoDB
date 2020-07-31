var express = require('express');
var router = express.Router();
var Servicio = require('../servicio/servicio');
router.get('/', function (req, res, next) {
    var servicio = new Servicio();
    servicio.mostrarDatos(function(err,mensaje,usuariosJSON){     
        if (err){         
            res.render('error',{mensaje : mensaje});   
        }else {
            res.render('mostrarDatos', { usuarios: usuariosJSON });   
        }        
    });    
});

module.exports = router;