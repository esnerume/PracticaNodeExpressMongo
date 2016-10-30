'use strict';

var path = require('path');
var fs = require('fs');
var config = require('../config/config');
var i18nstrings = false;

var i18nTranslate = function(language, genericMessage, callback) {
    if(!language) {
        language = config.defaultLanguage;
    }

    var getTranslationOrDefaultMessage = function(message) {
        if(i18nstrings[language].hasOwnProperty(message)){
            return i18nstrings[language][message];
        } else {
            return message;
        }
    }

    if(!i18nstrings) {
        fs.readFile(path.join(__dirname, '../resources/i18n/errors.json'), 'utf8', function (err, data) {
            if (err) throw err;
            i18nstrings = JSON.parse(data);
            callback(getTranslationOrDefaultMessage(genericMessage));

        });
    } else {
        return callback(getTranslationOrDefaultMessage(genericMessage));
    }

};

module.exports = i18nTranslate;