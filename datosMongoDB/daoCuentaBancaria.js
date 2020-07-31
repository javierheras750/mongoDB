var CuentaData = require('./Schema/cuentaSchema');
var mongoose = require('mongoose');
var CuentaBancaria = require('../modelo/cuentaBancaria');
var DaoCuentaBancaria = function () {
    this.conecta = function (callback) {
        mongoose.connect('mongodb://javier:javier@localhost:27017/clienteCuenta', { useNewUrlParser: true }, function (err) {
            if (err) {
              return callback(err, "Error de conexion: ");
            } else {
              return callback(false, "La conexion a la base de datos ha sido correcta");
            }
        });
    }
    this.desconecta = function () {
        mongoose.disconnect();
    }
    this.cuentaData = new CuentaData();
}
DaoCuentaBancaria.prototype.insertarCuenta = function (cuenta, dni, callback) {
    //Conectamos con la base de datos
    // this.conecta();
    //Verificamos la entrada de la cuenta
    if (!cuenta) {
        return callback(true, "No se ha introducido la cuenta");
    }
    //leemos el objeto JSON
    var cuentaJSON = cuenta.getJSON();
    //Asignamos los valores del objeto JSON a las columnas de la coleccion
    var array = Object.keys(cuentaJSON);

    for (i = 0; i < array.length; i++) {
        var clave = array[i];
        this.cuentaData[clave] = cuentaJSON[clave];
    }
    this.cuentaData.dni = dni;
    //Grabamos los datos

    this.cuentaData.save(function (err) {
        if (err) {
           return callback(err, "Error de inserccion en la coleccion cuenta, la clave primaria ya existe");
        } else {
            //   sThis.desconecta();  
           return  callback(null, "Todo correcto en la inserccion de la coleccion de cuenta");
        }
    });
}

DaoCuentaBancaria.prototype.borrarCuenta = function (id, callback) {
    if (this.existeCuenta(id)) {
        CuentaData.remove({ id: { '$eq': id } }, function (err) {
            if (err) {
                return callback(true, "Error de borrado");
            } else {                
               return callback(false, "La cuenta ha sido borrada correctamente");
            }
        }); 
    }else {
       return callback(true,"La cuenta no existe");
    }
}
DaoCuentaBancaria.prototype.getCuenta = function (dni, callback) {
    this.cuentas = [];
    var sThis = this;
    CuentaData.find({ dni: { '$eq': dni } }, function (err, documentos) {
        if (err) {
           return callback(err, null);
        } else {
            //insertamos los documentos en un array 
            for (i = 0; i < documentos.length; i++) {
                var documento = documentos[i];
                var cuenta = new CuentaBancaria();
                var id = documento.id;
                var saldo = documento.saldo;
                cuenta.setId(id);
                cuenta.setSaldo(saldo);
                sThis.cuentas[i] = cuenta;
            }
            var c = sThis.cuentas[0];
           return callback(err, 'La lectura ha sido correcta', c); // Retorna la unica cuenta del usuario
        }
    });
}

DaoCuentaBancaria.prototype.getCuentas = function (callback) {
    //Devolvemos una funcion de callback err,mensaje,resultados
    //Buscamos los usuarios de la coleccion Cuentas
    this.cuentas = [];
    var sThis = this;
    CuentaData.find({}, { dni: 1, id: 1, saldo: 1 }, function (err, documentos) {
        if (err) {
           return callback(err, "Error de lectura en la coleccion", null);
        } else {
            //insertamos los documentos en un array 
            for (i = 0; i < documentos.length; i++) {
                var documento = documentos[i];
                var cuenta = new CuentaBancaria();
                var dni = documento.dni;
                var id = documento.id;
                var saldo = documento.saldo;
                cuenta.setId(id);
                cuenta.setSaldo(saldo);
                sThis.cuentas[i] = cuenta;
            }
            return callback(null, 'Las lecturas han sido correctas', sThis.cuentas);
        }
    })

}


DaoCuentaBancaria.prototype.modificarCuenta = function (cuenta, callback) {
    this.cuen = cuenta;    
    //Verificamos la entrada de la cuenta
    if (!cuenta) {
        return callback(true, "No se ha introducido la cuenta");
    }    
    var id = cuenta.getId();
    var saldo = cuenta.getSaldo();    
    CuentaData.update({id : id },{$set: {saldo: saldo}},function (err) {
        if (err) {
           return callback(err, "Error de modificacion en la coleccion cuenta, la clave primaria ya existe");
        } else {
           return callback(null,"La modificacion ha tenido exito");
        }
    });
}


DaoCuentaBancaria.prototype.existeCuenta = function (dni) {
    return true;
}
module.exports = DaoCuentaBancaria;