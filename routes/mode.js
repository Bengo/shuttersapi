const express = require('express');
const router = express.Router();
const periodicRules = require('../modules/periodicrules');
const configRules = require('../modules/configRules');


//set mode status
router.post('/', function(req, res, next) {

  if(req.body.mode !== 'normal' && req.body.mode !== 'msd' && req.body.mode !== 'vacances' && req.body.mode !== 'abscence' && req.body.mode !== 'fete'){
    res.status('400').send('bad mode parameter');
  }

  configRules.config.currentMode = req.body.mode;
  periodicRules.update();

  res.send('Setting mode to  '+ req.body.mode);
})

module.exports = router;
