const express = require('express');
const router = express.Router();
const SunCalc = require('suncalc');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //Saint-Renan
  const times = SunCalc.getTimes( new Date(), 48.4333, -4.6167); 
  res.send('sunrise: '+times.sunriseEnd+' sunset :'+times.sunset);
});


module.exports = router;
