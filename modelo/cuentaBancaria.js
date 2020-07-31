var CuentaBancaria = function(){
    this.id='';
    this.saldo = 0;    
}
CuentaBancaria.prototype.setId= function(id){
    this.id = id;
}
CuentaBancaria.prototype.setSaldo= function(saldo){
    this.saldo = saldo;
}
CuentaBancaria.prototype.getId= function(){
   return this.id;
}
CuentaBancaria.prototype.getSaldo= function(){
    return this.saldo;
}
CuentaBancaria.prototype.getJSON = function(){
    return {
       id:this.id,
       saldo:this.saldo     
    }
}
module.exports = CuentaBancaria;