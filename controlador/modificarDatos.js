var express = require('express');
var router = express.Router();
var Servicio = require('../servicio/servicio');
router.get('/', function (req, res, next) {
  res.render('modificarDatos', { title: 'Bienvenido a modificar Datos' });
});
router.post('/', function (req, res, next) {
  var dni = req.body.dni;
  var servicio = new Servicio(); 
  servicio.getUsuario(dni, function (err, mensaje, usuarioJSON) {  
    if (err){    
      res.render('error', { mensaje : mensaje });
    }else{
      res.render('modificarDatos2', { title: 'Modificacion de datos', usuario : usuarioJSON});
    }    
  });
});






  module.exports = router;
