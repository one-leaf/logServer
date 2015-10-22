/**
 * Created by oneleaf on 15/10/21.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs'),
    path = require('path');

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

function getFiles(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isFile();
    }).reverse();
}

router.get('/:app', function(req, res, next) {
    var currApp=req.param('app');
    var dirs=getDirectories(this.app.get('logPath'));
    var apps=[]
    for ( var i=0; i<dirs.length; i++){
        var _app={}
        _app.name=dirs[i];
        if (_app.name===currApp){
            _app.active="active"
        }else{
            _app.active=""
        }
        apps.push(_app)
    }
    res.render('app', {
        currApp:currApp,
        apps:apps,
        files:getFiles(path.join(this.app.get('logPath'),currApp))
    });
});

router.get('/:app/:file', function(req, res, next) {
    var currApp=req.param('app');
    var logFile=req.param('file');
    if (currApp.indexOf('..')>=0||logFile.indexOf('..')>=0||!/log$/.test(logFile)){
        res.writeHead(403);
        res.end("当前文件不可访问，请检查。")
    } else {
        var downloadPath = path.join(this.app.get('logPath'), currApp);
        var downloadFile = path.join(downloadPath, logFile);
        console.log(downloadFile);
        res.sendFile(downloadFile)
    }
});

module.exports = function(app){
    this.app=app;
    return router;
}