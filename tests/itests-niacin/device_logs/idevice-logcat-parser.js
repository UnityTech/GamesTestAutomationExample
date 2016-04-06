var LogEntry = require('./logentry.js'),
  Tail = require('tail').Tail;

function IDeviceLogcatParser(logFile) {
    this.tail = new Tail(logFile);
    this.logFile = logFile;
    this.entries = [];
    this.headerHandled = false;
    var IDeviceLogcatParser = this;

    this.tail.on("line", function(data) {
        if (this.headerHandled) {
            IDeviceLogcatParser.parseAndStoreLine(data, function() {
            });
        } else {
            this.headerHandled = true;
        }
    });

    this.popEvents = function(cb) {
        var poppedEvents = this.entries.slice();
        this.entries = [];
        cb(poppedEvents);
    };

    this.parseAndStoreLine = function(line, cb) {
        // example format from idevicesyslog
        // Jan 25 10:04:39 iphone6s-4 unityads-appium[381] <Warning>: ENTERED_METHOD
        var parsingRegex = /(\S+) (\d+) (\d+):(\d+):(\d+)\s(.*)/;
        var mr = line.match(parsingRegex);

        if (mr === null) {
            if (/^---------\s*beginning\s*of\s*/.test(line)) {
              console.log("Didn\t parse the generic begin message");
            }
        } else {
            // match[0] is full message
            var year = new Date().getFullYear(),
                month = new Date(Date.parse(mr[1] +" 1, " +year)).getMonth()+1,
                day = parseInt(mr[2]),
                hour = parseInt(mr[3]),
                min = parseInt(mr[4]),
                sec = parseInt(mr[5]);
            var date = new Date(year, month, day, hour, min, sec);
            var message = mr[6];
            logEntry = new LogEntry(date, message);
            this.entries.push(logEntry);
        }
        cb();
    };
}


module.exports = IDeviceLogcatParser;
