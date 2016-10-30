'use strict';

var express = require('express');
var router = express.Router();

var jwtAuth = require('../../lib/jwtAuth');
// json web token auth
router.use(jwtAuth());
var CustomError = require('../../lib/errors');

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');



// Lista de Anuncios
router.get('/', function(req, res, next) {
    var nombre = req.query.nombre;
    var precio = req.query.precio;
    var venta = req.query.venta;
    var tag = req.query.tag;
    var includeTotal = req.query.includeTotal === 'true';
    var sort = req.query.sort || null;
    var limit = parseInt(req.query.limit) || null;
    var skip = parseInt(req.query.start) || 0;
    var fields = req.query.fields || null;

    var filter = {};

    if (typeof nombre !== 'undefined') {
        filter.nombre = new RegExp('^' + req.query.nombre, 'i');
    }

    if (typeof venta !== 'undefined') {
        if(venta === 'true') {
            filter.venta = true;
        }else if(venta === 'false') {
            filter.venta = false;
        }
    }

    if(typeof tag !== 'undefined') {
        filter.tags = { '$in': [tag]};
    }

    if (typeof precio !== 'undefined') {
        var extraerNumeros = function (precio) {
            return precio.match(/[0-9]+(\.[0-9][0-9]?)?/g);
        };

        if (/^\d{1,}\.?\d{1,}-$/.test(precio)) {
            var valorMayorQue = extraerNumeros(precio)[0];
            filter.precio = {'$gte': parseFloat(valorMayorQue)};
        } else if (/^-\d{1,}\.?\d{1,}$/.test(precio)) {
            var valorMenorQue = extraerNumeros(precio)[0];
            filter.precio = {'$lte': parseFloat(valorMenorQue)};
        } else if (/^\d{1,}\.?\d{1,}-\d{1,}\.?\d{1,}$/.test(precio)) {
            var valores = extraerNumeros(precio);
            var valorDesde = valores[0];
            var valorHasta = valores[1];
            filter.precio = {'$gte': parseFloat(valorDesde), '$lte': parseFloat(valorHasta)};
        } else if (/^\d{1,}\.?\d{1,}$/.test(precio)) {
            var valorIgualQue = extraerNumeros(precio)[0];
            filter.precio = parseFloat(valorIgualQue);
        } else {
            next(CustomError(400, 'MALFORMED_PRICE_RANGE'));
            return;
        }
    }

    Anuncio.list(filter, sort, limit, skip, fields)
        .then(function(anuncios) {
            var diccionarioRespuesta = {success: true, anuncios: anuncios};
            if(includeTotal) {
                Anuncio.countDocuments(filter)
                    .then(function(cuantos){
                        diccionarioRespuesta.total = cuantos;
                        res.json(diccionarioRespuesta);
                    })
                    .catch(next);
            } else {
                res.json(diccionarioRespuesta);
            }
        })
        .catch(next);

});

module.exports = router;