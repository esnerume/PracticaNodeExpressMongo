'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.json({success: true, info: 'nodepop API v1.0'});
});

module.exports = router;
