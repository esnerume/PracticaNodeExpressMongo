'use strict';

var jwt = require('jsonwebtoken');

// Cargamos el módulo de configuración para acceder al secret key
var config = require('../config/config');
var CustomError = require('./errors');

module.exports = function() {
    return function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
            // verifies secret and checks exp
            // Cargamos el secret key de la configuración
            jwt.verify(token, config.jwtsecret, function(err, decoded) {
                if (err) {
                    next(CustomError(403, 'FAILED_AUTHENTICATE_TOKEN'));
                    return;
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            next(CustomError(403, 'NO_TOKEN_PROVIDED'));
            return;
        }
    };
};
