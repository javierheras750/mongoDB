var $ = require('jquery');
var Servicio = require('../servicio/servicio');
var $boton = null;
$(document).ready(function () {
    $boton = $('button#boton');
    $boton.click(function(){        
      console.log('pulsado');
    });
});