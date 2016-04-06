var AdbLogcatParser = require('./adb-logcat-parser.js'),
    LogEntry = require('./logentry.js'),
    IDeviceLogcatParser = require('./idevice-logcat-parser.js');


parseJsonFromMessage = function(stringMessage) {
  var jsonStart = stringMessage.indexOf('{');
  var jsonEnd = stringMessage.lastIndexOf('}') + 1;
  var jsonStr = stringMessage.substring(jsonStart, jsonEnd);
  var parsedJson;
  try {
    parsedJson = JSON.parse(jsonStr);
  } catch(err) {
    console.log("ERROR: Could not parse JSON-string! " + err);
    console.log("trying to parse JSON-string: '" + jsonStr + "'");
    console.log("which was seen in message: '" + stringMessage + "'");
    console.log("returning null");
    return null;
  }
  return parsedJson;
};

// The log (at least on android) is cleared whenever it is accessed.
// This class helps keep track of the essential part of the log and
// access stuff like JSON-parsed data.
// Allowed logTypes: ["logcat" (default), "adbworkaround"]
function LogCatcher(logType, regexFilter, driver) {
  this.logType = logType;
  this.regexFilter = regexFilter;
  this.driver = driver;
  this.entries = [];
  this.waitForMessageCompleted = {};
  var lg = this;

  this.getLatestMessagesAppium = function(cb){
    this.driver
      .log(logType)
      .then(function(logBuffer){
        try {
          var newEntries = logBuffer.filter(function(entry) {
            return lg.regexFilter.test(entry.message);
          });
          var newLogEntries = newEntries.map(function(entry){
            var epochTime = entry.timestamp;
            var properDate = new Date(epochTime);
            var logE = new LogEntry(properDate, entry.message);
            return logE;
          });
          lg.entries = lg.entries.concat(newLogEntries);
        } catch(err) {
          console.log("Error in getLatestMessagesAppium: " + err);
          throw err;
        }
        cb();
      });
  };

  this.getLatestMessagesWorkaround = function(cb){
    this.adbLogcatParser.popEvents(function(newEvents){
      var newEntries = newEvents.filter(function(entry) {
        return lg.regexFilter.test(entry.message);
      });
      lg.entries = lg.entries.concat(newEntries);
      cb();
    });
  };

    this.getLatestMessagesWorkaroundIOS = function(cb) {
        this.iDeviceLogcatParser.popEvents(function(newEvents) {
            var newEntries = newEvents.filter(function(entry) {
                return lg.regexFilter.test(entry.message);
            });
            lg.entries = lg.entries.concat(newEntries);
            cb();
        });        
    };


  if(logType == "adbworkaround"){
    this.adbLogcatParser = new AdbLogcatParser('./logcat.log');
    this.getLatestMessages = this.getLatestMessagesWorkaround;
  } else if (logType == "ideviceworkaround") {
      this.iDeviceLogcatParser = new IDeviceLogcatParser('./logcat.log');
      this.getLatestMessages = this.getLatestMessagesWorkaroundIOS;
  } else {
      this.getLatestMessages = this.getLatestMessagesAppium;
  }


  this.clearMessages = function() {
    this.getLatestMessages(function(){
      this.entries = [];
    });
  };

  this.findEntries = function(filterRegex, cb) {
    lg.getLatestMessages(function(){
      var matchingEntries = lg.entries.filter(function(entry){
        return filterRegex.test(entry.message);
      });
      cb(matchingEntries);
    });
  };

  this.findLastEntry = function(filter, cb) {
    this.findEntries(filter, function(matchingEntries){
      cb(matchingEntries[matchingEntries.length - 1]);
    });
  };

  this.waitForMessageLoopee = function(previousMessage, filter, timeWhenGivingUp, pollInterval, cb){
    var d = new Date();
    if(timeWhenGivingUp < d.getTime()){
      throw new Error("No such message found within timeout! '" + filter + "'");
    }
    this.findLastEntry(filter, function(currentMessage){
      if(!currentMessage || (previousMessage && previousMessage.time != currentMessage.time)){
        process.stdout.write('.');
        setTimeout(function() {lg.waitForMessageLoopee(previousMessage, filter, timeWhenGivingUp, pollInterval, cb); }, pollInterval);
      } else {
        if(!lg.waitForMessageCompleted[filter]){
          console.log('Done');
          lg.waitForMessageCompleted[filter] = true;
          cb(currentMessage);
        }
      }
    });
  };

  // wait until message matching filter is seen, timeout and pollInterval in ms
  // The message needs to arrive after this method is called
  this.waitForMessage = function(filter, timeout, pollInterval, cb){
    console.log("waiting for message matching '" + filter + "'");
    this.waitForMessageCompleted[filter] = false;
    this.findLastEntry(filter, function(previousMessage){
      var timeWhenGivingUp = new Date().getTime + timeout;
      lg.waitForMessageLoopee(previousMessage, filter, timeWhenGivingUp, pollInterval, cb);
    });
  };

  this.jsonObjectFromLastEntry = function(filter, cb) {
    this.findLastEntry(filter, function(entry){
      var retval = null;
      if(entry){
        retval = parseJsonFromMessage(entry.message);
      }
      cb(retval);
    });
  };

  this.printEntries = function(cb) {
    if(lg.entries.length === 0){
      console.log("No entries");
      cb();
    }
    var entriesOutputted = 0;
    var entry;
    for(var entryIdx in lg.entries){
      entry = lg.entries[entryIdx];
      console.log("In log: [" + entry.time + "] " + entry.message);
      entriesOutputted += 1;
      if(entriesOutputted === lg.entries.length){
        cb();
      }
    }
  };
}

module.exports = LogCatcher;
