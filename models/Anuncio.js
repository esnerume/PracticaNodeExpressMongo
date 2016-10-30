'use strict';

var mongoose = require('mongoose');

var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta:  Boolean,
    precio: Number,
    foto:   String,
    tags:   [String]
});

// Creamos diversos índices a nivel de Schema para facilitar las búsquedas
// (en principio uno por cada campo por el que es posible buscar y otro que contenga todos. Es posible que en el corto medio plazo
// haga falta meter más combinaciones, pero de momento es suficiente para tener unas búsquedas suficientemente ágiles)
anuncioSchema.index({ nombre: 1 });
anuncioSchema.index({ venta: 1 });
anuncioSchema.index({ precio: 1 });
anuncioSchema.index({ tags: 1 });
anuncioSchema.index({ nombre: 1, venta: 1, precio: 1, tags: 1 });

anuncioSchema.statics.list = function(filter, sort, limit, skip, fields) {
    return new Promise(function(resolve, reject) {
        var query = Anuncio.find(filter);
        query.sort(sort);
        query.limit(limit);
        query.skip(skip);
        query.select(fields);
        query.exec(function(err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};


anuncioSchema.statics.countDocuments = function(filter) {
    return new Promise(function(resolve, reject){
        Anuncio.count(filter, function (err, count) {
            if (err) {
                reject(err);
                return;
            }
            resolve(count);
        });
    });
};


var Anuncio = mongoose.model('Anuncio', anuncioSchema);