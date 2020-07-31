var bodyParser = require('body-parser');
var cookie = require('cookie-session');
var ejs = require('ejs');
var express = require('express');
var path = require('path');
var http = require('http');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var port = process.env.PORT || 4200;
var app = express();
var server = http.createServer(app);
var index = require('./controlador/index');
var insertarDatos = require('./controlador/insertarDatos');
var mostrarDatos = require('./controlador/mostrarDatos');
var borrarDatos = require('./controlador/borrarDatos');
var modificarDatos = require('./controlador/modificarDatos');
var modificarDatos2 = require('./controlador/modificarDatos2');
var error = require('./controlador/error');
server.listen(port, function () {
console.log('Servidor escuchando en el puerto %d', port);
});
app.set('port', port);
var viewPath = path.join('./vista'); //Establecemos el camino relativo en ./vista
app.set('views',viewPath);
app.set('view engine', 'jade');
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
var viewPath = path.join('./');
app.use(express.static(path.join(viewPath)));
app.use(morgan('dev'));
app.use('/',index);
app.use('/insertarDatos',insertarDatos);
app.use('/mostrarDatos',mostrarDatos);
app.use('/borrarDatos',borrarDatos);
app.use('/modificarDatos',modificarDatos);
app.use('/modificarDatos2',modificarDatos2);
app.use('/error',error);
app.use(function(req, res, next) { 
res.status = 404; 
res.render('error', { error: 'HTTP/1.1 404 Not Found' });
});

