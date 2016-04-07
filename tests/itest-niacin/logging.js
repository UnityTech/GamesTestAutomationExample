"use strict";
/* jshint node: true */

// log outputs will flood the terminal, truncate data output to avoid this.
var consoleOutputTruncateLength = 200;

exports.configure = function (driver) {
  // See whats going on
  driver.on('status', function (info) {
    console.log(info.cyan);
  });
  driver.on('command', function (meth, path, data) {
    console.log(' > ' + meth.yellow,
                path.grey,
                (data || '').substr(0,consoleOutputTruncateLength));
  });
  driver.on('http', function (meth, path, data) {
    console.log(' > ' + meth.magenta,
                path,
                (data || '').substr(0,consoleOutputTruncateLength).grey);
  });
};
