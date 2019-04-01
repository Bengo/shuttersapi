var express = require('express');
var router = express.Router();
const Shutters = require('../modules/shutters');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/:zone', function(req, res, next) {
  if(req.params.zone !== '1' && req.params.zone !== '2' && req.params.zone !== '3' && req.params.zone !== '4'){
    res.status('400').send('bad zone parameter');
  }

  if(req.body.position !== 'top' && req.body.position !== 'bottom' && req.body.position !== 'intermediate'){
    res.status('400').send('bad position parameter');
  }
  let shutters = new Shutters();
  shutters.goTo(req.params.zone, req.body.position);
  res.send('receive command for zone '+ req.params.zone + ' to go to position ' + req.body.position);
})

module.exports = router;
