var Usuario = require('../modelo/usuario');
var DaoCuentaBancaria = require('./daoCuentaBancaria');
var UsuarioData = require('./Schema/usuarioSchema');
var CuentaBancaria = require('../modelo/cuentaBancaria');
var mongoose = require('mongoose');
var DaoUsuario = function () { 
    this.conecta = function (callback) {
        mongoose.connect('mongodb://javier:javier@localhost:27017/clienteCuenta', { useNewUrlParser: true }, function (err) {
            if (err) {
                return callback(err, "Error de conexion con la base de datos ");
            } else {
                return callback(false, "La conexion a la base de datos ha sido correcta");
            }
        });
    }
    this.desconecta = function () {
        mongoose.disconnect();
    }
    this.usuarioData = new UsuarioData();
    this.daoCuentaBancaria = new DaoCuentaBancaria();
}
DaoUsuario.prototype.insertarUsuario = function (usuario, callback) {
    this.usu = usuario;
    var aThis = this;
    //Conectamos con la base de datos
    this.conecta(function (err, mensaje) {
        if (err) {
            return callback(err, mensaje);
        } else {           
            aThis.existeUsuario(usuario.getDni(), function (existe) {
                var sThis = aThis;
                if (existe) {
                    return callback(existe, "El usuario existe en la base de datos");
                } else {
                    //leemos el objeto JSON
                    var usuarioJSON = usuario.getJSON();
                    //Asignamos los valores del objeto JSON a las columnas de la coleccion
                    var array = Object.keys(usuarioJSON);
                    for (i = 0; i < array.length; i++) {
                        var clave = array[i];
                        if (clave != 'cuenta') {
                            sThis.usuarioData[clave] = usuarioJSON[clave];
                        }
                    }
                    //Grabamos los datos
                    var zThis = sThis;
                    sThis.usuarioData.save(function (err) {
                        if (err) {
                            return callback(err, "Error de inserccion en la coleccion usuario, la clave primaria ya existe");
                        } else {
                            var cuenta = sThis.usu.getCuenta();
                            zThis.daoCuentaBancaria.insertarCuenta(cuenta, sThis.usu.getDni(), function (err, mensaje) {
                                if (err) {
                                    zThis.desconecta();
                                    return callback(err, mensaje);
                                } else {
                                    zThis.desconecta();
                                    return callback(null, "Insercion de usuario correcto");
                                }
                            })
                        }
                    });

                }
            });
        }
    });

}
DaoUsuario.prototype.getUsuarios = function (callback) {
    var aThis = this;
    //Conectamos con la base de datos
    this.conecta(function (err, mensaje) {
        if (err) {
            return callback(err, mensaje);
        } else {
            //Devolvemos una funcion de callback err,mensaje,resultados
            //Buscamos los usuarios de la coleccion usuarios
            aThis.usuarios = [];
            var sThis = aThis;
            UsuarioData.aggregate([{ $lookup: { from: "cuentas", localField: "dni", foreignField: "dni", as: "relacion" } }], function (err, documentos) {
                if (err) {
                    return callback(err, "err", null);
                } else {
                    //insertamos los documentos en un array           
                    for (i = 0; i < documentos.length; i++) {
                        var documento = documentos[i];
                        var dni = documento.dni;
                        var nombre = documento.nombre;
                        var primerApellido = documento.primerApellido;
                        var segundoApellido = documento.segundoApellido;
                        usuario = new Usuario();
                        usuario.setDni(dni);
                        usuario.setNombre(nombre);
                        usuario.setPrimerApellido(primerApellido);
                        usuario.setSegundoApellido(segundoApellido);
                        var cuenta = documento.relacion[0];
                        var id = cuenta.id;
                        var saldo = cuenta.saldo;
                        var cuenta = new CuentaBancaria();
                        cuenta.setId(id);
                        cuenta.setSaldo(saldo);
                        usuario.setCuenta(cuenta);
                        sThis.usuarios.push(usuario);
                    }
                    sThis.desconecta();
                    return callback(err, "La Busqueda fue correcta", sThis.usuarios);
                }
            });
        }
    });
}
DaoUsuario.prototype.borrarUsuario = function (dni, callback) {
    var aThis = this;
    //Conectamos con la base de datos
    this.conecta(function (err, mensaje) {
        if (err) {
            return callback(err, mensaje);
        } else {
            //Si existe el usuario
            aThis.existeUsuario(dni, function (existe) {
                var sThis = aThis;
                if (!existe) {
                    return callback(true, "El usuario no existe en la base de datos");
                } else {
                    //Borramos el usuario       
                    UsuarioData.remove({ dni: { '$eq': dni } }, function (err) {
                        if (err) {
                            zThis.desconecta();
                            return callback(true, "Error de borrado");
                        } else {
                            //Borramos la dependencia
                            var zThis = sThis;
                            //Borramos la dependencia
                            sThis.daoCuentaBancaria.borrarCuenta(dni, function (err, mensaje) {
                                if (err) {
                                    zThis.desconecta();
                                    return callback(true, mensaje);
                                } else {
                                    zThis.desconecta();
                                    return callback(false, "El usuario ha sido borrado correctamente");
                                }
                            })

                        }
                    });


                }
            });
        }
    });
};
DaoUsuario.prototype.modificarUsuario = function (usuario, callback) {
    this.usu = usuario;
    var aThis = this;
    //Conectamos con la base de datos
    this.conecta(function (err, mensaje) {
        if (err) {
            return callback(err, mensaje);
        } else {


            aThis.existeUsuario(usuario.getDni(), function (existe) {
                var sThis = aThis;
                if (!existe) {
                    return callback(true, "El usuario no existe en la base de datos");
                } else {
                    var dni = usuario.getDni();
                    var nombre = usuario.getNombre();
                    var primerApellido = usuario.getPrimerApellido();
                    var segundoApellido = usuario.getSegundoApellido();
                    UsuarioData.update({ dni: dni }, { $set: { nombre: nombre, primerApellido: primerApellido, segundoApellido: segundoApellido } }, function (err) {
                        if (err) {
                            return callback(err, "Error de modificacion en la coleccion usuario, la clave primaria ya existe");
                        }
                    });
                    var cuenta = sThis.usu.getCuenta();
                    sThis.daoCuentaBancaria.modificarCuenta(cuenta, function (err, mensaje) {
                        if (err) {
                            return callback(err, mensaje);
                        }
                        else {
                            return callback(null, "El usuario ha sido modificado correctamente");
                        }
                    });

                }
            });

        }
    });

}
DaoUsuario.prototype.getUsuario = function (dni, callback) {
    this.dni = dni;
    //Conectamos con la base de datos
    this.conecta(function (err, mensaje) {
        if (err) {
            return callback(err, mensaje);
        }
    });
    //Buscamos los usuarios de la coleccion usuarios   
    var sThis = this;
    UsuarioData.aggregate([{ $lookup: { from: "cuentas", localField: "dni", foreignField: "dni", as: "relacion" } }], function (err, documentos) {
        if (err) {
            return callback(err, 'Error en la busqueda del usuario', null);
        } else {
            //Buscamos el documento dentro del array
            var i = -1;
            do {
                let documento = documentos[i + 1];
                if (sThis.dni == documento.dni) { //Si el elemento ha sido encontrado
                    let dni = documento.dni;
                    let nombre = documento.nombre;
                    let primerApellido = documento.primerApellido;
                    let segundoApellido = documento.segundoApellido;
                    usuario = new Usuario();
                    usuario.setDni(dni);
                    usuario.setNombre(nombre);
                    usuario.setPrimerApellido(primerApellido);
                    usuario.setSegundoApellido(segundoApellido);
                    var cuenta = documento.relacion[0];
                    let id = cuenta.id;
                    let saldo = cuenta.saldo;
                    var cuenta = new CuentaBancaria();
                    cuenta.setId(id);
                    cuenta.setSaldo(saldo);
                    usuario.setCuenta(cuenta);
                    var usuarioJSON = usuario.getJSON();
                    sThis.desconecta();
                    return callback(false, "La busqueda fue correcta", usuarioJSON);
                }
                i = i + 1;
            } while (i < documentos.length - 1);
            return callback(true, "El usuario no se encuentra en la base de datos", null);
        }
    });
}
DaoUsuario.prototype.existeUsuario = function (dni, callback) {
    UsuarioData.find({ dni: { '$eq': dni } }, function (err, documento) {
        if (err) {
            return callback(false);
        } else {
            if (documento.length == 1) {
                return callback(true);
            } else {
                return callback(false);
            }
        }
    });
}
module.exports = DaoUsuario;


