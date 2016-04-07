"use strict";

/* jshint node: true */
/* global describe, it, before, after, afterEach, context */ //Mocha globals

var
  setup = require("./setup-device"),
  wd = require("wd"),
  LogCatcher = require("./itest-niacin/device_logs/log-catcher.js");

var
  platform = process.env.APPIUM_PLATFORM;

var waitByLinkOrName = function (text, timeout){
  if(process.env.APPIUM_AUTOMATION == "Selendroid"){
    return this.waitForElementByLinkText(text, timeout);
  } else {
    return this.waitForElementByName(text, timeout);
  }
};
 wd.addPromiseChainMethod('waitByLinkOrName', waitByLinkOrName);

describe("Unity example automation tests " + platform + " Native", function () {
  this.timeout(450000);
  var driver;
  var allPassed = true;
  var logType = "adbworkaround";
  var logFilterStr = new RegExp("^.\/" + process.env.APPIUM_APP_ACTIVITY);
  var logCatcher = new LogCatcher(logType, logFilterStr, driver);

  before(function () {
    driver = wd.promiseChainRemote(setup.serverConfig);
    return driver
      .init(setup.desired)
      .setImplicitWaitTimeout(3000);
  });

  after(function () {
    return driver.quit();
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
    if(this.currentTest.state == 'failed'){
      var screenshotFileName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
      return driver.saveScreenshot("screenshots/" + screenshotFileName);
    } else {
      return driver;
    }
  });

  context("Main menu", function () {
    it("Gets the message that game was started", function (done) {
      logCatcher
        .waitForMessage("Game Started", 25000, 100, function(entry){
          console.log("Got message '" + entry.message + "'");
        });
    });
  });
});
