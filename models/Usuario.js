'use strict';

var mongoose = require('mongoose');

var usuarioSchema = mongoose.Schema({
    nombre: String,
    email: {type: String, index: true}, // Metemos un índice a nivel de campo para agilizar las búsquedas a través de la operación de login
    clave: String
});

usuarioSchema.statics.findByEmail = function(email) {
    return new Promise(function(resolve, reject) {
        var filter = {'email': email};
        var query = Usuario.find(filter);
        query.exec(function(err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });

    });
};

var Usuario = mongoose.model('Usuario', usuarioSchema);