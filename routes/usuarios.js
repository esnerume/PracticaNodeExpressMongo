'use strict';


var express = require('express');
var router = express.Router();


var config = require('../config/config');
var CustomError = require('../lib/errors');
var mongoose = require('mongoose');
var sha256 = require('sha256');

var Usuario = mongoose.model('Usuario');

router.post('/register', function(req, res, next) {
    let name = req.body.name;
    let user = req.body.user;
    let pass = req.body.pass;

    if (typeof name === 'undefined' || typeof user === 'undefined' || typeof pass === 'undefined') {
        next(CustomError(400,'INCOMPLETE_DATA'));
        return;
    }
    Usuario.findByEmail(user)
        .then(function(usuarios) {
            if (usuarios && usuarios.length > 0) {
                next(CustomError(409, 'USER_ALREADY_EXISTS'));
                return;
            } else {
                var usuario = new Usuario({'nombre': name, 'email': user, 'clave': sha256(pass)});

                usuario.save(function(err, usuarioGuardado) {
                    if (err) {
                        next(err);
                        return;
                    }
                    res.json({success: true, usuario: usuarioGuardado.email});
                });
            }
        })
        .catch(next);
});




var jwt = require('jsonwebtoken');
router.post('/authenticate', function(req, res, next) {
    let user = req.body.user;
    let pass = req.body.pass;

    if (typeof user === 'undefined' || typeof pass === 'undefined') {
        next(CustomError(400,'INCOMPLETE_DATA'));
        return;
    }
    var hashedPassword = sha256(pass);

    Usuario.findByEmail(user)
        .then(function(usuarios) {
            if(usuarios && usuarios.length >0) {
                if(usuarios[0].clave === hashedPassword) {
                    let token = jwt.sign({id: usuarios[0].email}, config.jwtsecret, {
                        expiresIn: '2 days'
                    });
                    res.json({success:true, token: token});
                } else {
                    next(CustomError(403, 'INVALID_CREDENTIALS'));
                }
            } else {
                next(CustomError(403, 'INVALID_USER'));
            }
        })
        .catch(next);
});

module.exports = router;
