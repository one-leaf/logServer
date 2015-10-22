var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('api', {});
});

var log = require('../lib/log').createParse();

router.post('/', function(req, res) {
  var parse = {
    'parse': req.body,
    'logPath': app.get('logPath')
  };
  log.emit("has-parse", parse);
  res.json({success:true});
});

module.exports = function(app){
  this.app=app;
  return router;
}
