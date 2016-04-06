var LogEntry = require('./logentry.js'),
  Tail = require('tail').Tail;

function AdbLogcatParser(logFile){
  this.tail = new Tail(logFile);
  this.logFile = logFile;
  this.entries = [];
  this.headerHandled = false;
  var adbLogcatParser = this;

  this.tail.on("line", function(data) {
    if(this.headerHandled){
      adbLogcatParser.parseAndStoreLine(data, function(){
      });
    } else {
      this.headerHandled = true;
    }
  });

  this.parseAndStoreLine = function(line, cb){
    var parsingRegex = /(\d+)-(\d+)\s(\d+):(\d+):(\d+)\.(\d+)\s(.*)/;
    var mr = line.match(parsingRegex);
    // Example format from logcat
    //08-27 06:44:21.083 D/UnityAds( 2307): com.unity3d.ads.android.video.UnityAdsVideoPlayView.clearVideoPlayer() (line:136) :: ENTERED METHOD
    if(mr === null){
      if(/^---------\s*beginning\s*of\s*/.test(line)){
        console.log("Didn't parse the generic begin message");
      } else {
        console.log("Could not parse logcat line '" + line + "'");
      }
    } else {
      // match[0] is full message.
      var year = new Date().getFullYear(),
        month = parseInt(mr[1]) - 1, // months 0-11
        day = parseInt(mr[2]), // days 1-31
        hour = parseInt(mr[3]),
        min = parseInt(mr[4]),
        sec = parseInt(mr[5]),
        millisec = parseInt(mr[6]);
      var date = new Date(year, month, day, hour, min, sec, millisec);
      var message = mr[7];
      logEntry = new LogEntry(date, message);
      this.entries.push(logEntry);
    }
    cb();
  };

  this.popEvents = function(cb){
    var poppedEvents = this.entries.slice();
    this.entries = [];
    cb(poppedEvents);
  };
}

module.exports = AdbLogcatParser;
