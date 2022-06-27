require('dotenv').config()
const mongoose = require('mongoose');
const app = require('./app');
const {registrarAdmin} = require('./src/controllers/usuario.controller')

mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;                                                                  
mongoose.connect( process.env.DB_CONECTION, { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Conectado a la base de datos.");

    app.listen(process.env.PORT || 3000, function () {
        console.log("Corriendo en el puerto!")
    })

}).catch(error => console.log(error));

registrarAdmin();