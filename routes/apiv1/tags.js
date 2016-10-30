'use strict';

var express = require('express');
var router = express.Router();

var jwtAuth = require('../../lib/jwtAuth');
// json web token auth
router.use(jwtAuth());

router.get('/', function(req, res) {
    var tags = ['work', 'lifestyle', 'motor', 'mobile'];
    res.json({success: true, tags: tags});
});

module.exports = router;

