const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function registrarAdmin() {

    var modeloUsuario = new Usuario();
  
    Usuario.find({ email: 'admin@gmail.com' }, (err, usuarioEncontrado) => {
      if (usuarioEncontrado.length > 0) {
        return console.log('Este correo ya se encuentra utilizado.');
      } else {

              modeloUsuario.nombre = 'Admin';
              modeloUsuario.email = 'admin@gmail.com';
              modeloUsuario.rol = 'ROL_ADMIN';
  
              bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                  modeloUsuario.password = passwordEncriptada;
  
                  modeloUsuario.save((err, usuarioGuardado) => {
                      if (err) return console.log('Error en la peticion')
                      if (!usuarioGuardado) return console.log('Error al registrar usuario');
                      
                      return console.log('usuario:' + ' ' + usuarioGuardado);
                  });
              })
       
      }
    });
  }



  module.exports = {
    registrarAdmin,

}
