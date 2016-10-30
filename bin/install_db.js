'use strict';

var fs = require('fs');
var process = require('process');
var mongoose = require('mongoose');


// No enganchamos al evento de conexion a la BD para lo primero de todo borra la base de datos y despues cargarla
mongoose.connection.once('connected', () => {
    mongoose.connection.db.dropDatabase(function(err){
        if(!err) {
            var Anuncio = mongoose.model('Anuncio');

            var cargarAnuncios = function(callback) {
                var contents = fs.readFileSync('./resources/mongo/anuncios.json');
                var json_anuncios = JSON.parse(contents);
                var anuncios = json_anuncios.anuncios;
                Anuncio.collection.insert(anuncios, function () {
                   if(!err) {
                       console.log('Anuncios insertados');
                   }
                   callback();
                });

            };

            var Usuario = mongoose.model('Usuario');
            var cargarUsuarios = function(callback) {
                var contents = fs.readFileSync('./resources/mongo/usuarios.json');
                var json_usuarios = JSON.parse(contents);
                var usuarios = json_usuarios.usuarios;
                Usuario.collection.insert(usuarios, function () {
                    if(!err) {
                        console.log('Usuarios Insertados');
                    }
                    callback();
                });

            };
            // Una vez que cargamos los anuncios y los usuario finalizamos el Script
            cargarAnuncios(cargarUsuarios(function(){ process.exit(0); }));

        } else {
            console.log('No se pudo borrar la BD!!!', err);
        }
    });
});


// Añadimos los modelos de la aplicación
require('../models/Anuncio.js');
require('../models/Usuario.js');
// Utilizamos la librería de conexión a la BD que es común a toda la aplicación
require('../lib/mongoConnection');
