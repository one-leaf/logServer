/**
 * Created by oneleaf on 15/10/19.
 */
var mkdirp = require('mkdirp');
var fs = require('fs');
var dateFormat = require('dateformat');

var StreamLogger = function(logFile) {
    this.logFile=logFile;
    this.stream = null;
   // this.open();
};

//建立目录和文件写入流
StreamLogger.prototype.open = function(callback) {
    var self = this;
    var emitter = self.emitter;
    var dir = self.logFile.substring(0, self.logFile.lastIndexOf('/'));
    mkdirp(dir, {mode:0777}, function (err) {
        if (err) {
            console.error(dir+'目录创建失败，Err:'+err);
        } else {
            console.log('create file steam for '+self.logFile);
            self.stream = fs.createWriteStream(self.logFile, {
                flags: 'a',
                mode: 0644,
                encoding: 'utf8'
            });
            self.stream.on('open', function(fd) {
                if(callback) callback();
            });
            self.stream.on('error', function(err) {
                console.error(err)
            });
        }
    });
};

//关闭日志文件写入流
StreamLogger.prototype.close = function(callback) {
    if (this.stream) {
        this.stream.end();
    }
    if(callback) callback();
};

//重新打开文件写入流
StreamLogger.prototype.reopen = function(callback) {
    var slSelf = this;
    this.close(function() {
        slSelf.open(function() {
            if(callback) callback();
        });
    });
};

//保存方法
StreamLogger.prototype.save = function(message, callback) {
    var self = this;
    var outMessage = dateFormat(new Date(),'yyyy-mm-dd HH:MM:ss') + ' : ' + message;
    var flg = fs.existsSync(this.logFile);
    if(flg) {
        if (!this.stream) {
            self.open(function(){
                writeFile(self.stream, outMessage, callback);
            })
        } else {
            writeFile(self.stream, outMessage, callback);
        }
    } else {
        console.log(dateFormat(new Date(),'yyyy-mm-dd HH:MM:ss')+' : ' + this.logFile +' 文件不存在重建文件.');
        self.reopen(function() {
            writeFile(self.stream, outMessage, callback);
        });
    }
};

var writeFile = function(fstream, outMessage, callback) {
//    console.log(outMessage);
    fstream.write(outMessage + "\r\n");
    if(callback) callback();
};


exports.logger = function(logfile) {
    var _logger = new StreamLogger(logfile);

    return {
        save: function(msg) {
            _logger.save(msg);
        }
    };
};