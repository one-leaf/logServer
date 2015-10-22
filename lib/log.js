/**
 * Created by oneleaf on 15/10/19.
 */
var utils = require("util");
var events = new require("events").EventEmitter;
var fs = require('fs');
var async = require('async')
var logFile = require('./logFile');
var path = require('path');
var dateFormat = require('dateformat');

//对事件最大数量不做限制，避免保存失败
process.setMaxListeners(0);

//创建执行队列，最大10个并发
var q = async.queue(function(item, cb) {
    var _length = q.length();
    if(_length % 100 == 0 && _length != 0) {
        console.log('log队列大小：' + _length);
    }
    dealLogs(item.task, cb);
}, 10);

//队列执行
var logInstance = {};
var dealLogs = function(task, callback) {
    var jsonObj = task.parse;
    var logPath = task.logPath;
    var appName = jsonObj.app||'log';
    var log = logInstance[appName];
    var now = new Date();
    logFileName=path.join(logPath,appName+'/'+dateFormat(now,'yyyy-mm-dd')+".log")
    if (log == undefined) {
        log = logFile.logger(logFileName);
        logInstance[appName] = log;
    } else {
        log.logFile=logFileName;
    }
    var msg = jsonObj.msg;
    log.save(msg);
    callback();
}

//日志接收事件
var LogParse = function() {
    var self = this;
    self.on('has-parse', function(task) {
        q.push({
            'task': task
        }, function() {});
    });
}

utils.inherits(LogParse, events);

exports.createParse = function() {
    return new LogParse();
}