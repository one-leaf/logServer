var express = require('express');
var router = express.Router();
var fs = require('fs'),
    path = require('path');

function getDirectories(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}


/* GET home page. */
router.get('/', function(req, res, next) {
  var dir=getDirectories(this.app.get('logPath'));
  res.render('index', {apps:dir});
});

module.exports = function(app){
  this.app=app;
  return router;
}