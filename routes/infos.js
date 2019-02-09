const express = require('express');
const router = express.Router();
const periodicRules = require('../modules/periodicrules');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(periodicRules.infos());
});

module.exports = router;
