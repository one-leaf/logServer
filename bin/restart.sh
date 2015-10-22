#!/bin/bash

pid=`cat process.pid`
if [ -z $pid ]
then
 echo "logsServer is not running."
else
 kill -9 $pid
fi
node wwww.js > log.log&