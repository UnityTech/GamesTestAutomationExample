"use strict";

/* jshint node: true */
/* global describe, it, before, after, afterEach, context */ //Mocha globals

var
  setup = require("./setup-device"),
  wd = require("wd");

var
  platform = process.env.APPIUM_PLATFORM;

var waitByLinkOrName = function (text, timeout){
  if(process.env.APPIUM_AUTOMATION == "Selendroid"){
    return this.waitForElementByLinkText(text, timeout);
  } else {
    return this.waitForElementByName(text, timeout);
  }
}
 wd.addPromiseChainMethod('waitByLinkOrName', waitByLinkOrName);

describe("Unity Ads Example test " + platform + " Native", function () {
  this.timeout(450000);
  var driver;
  var allPassed = true;
  var logCatcher;

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

  context("options", function () {
    it("displays the button and clicks it", function () {
      return driver
        .waitByLinkOrName("?", 25000)
        .click();
    })
    it("displays the developer ID tag", function () {
      return driver
        .waitByLinkOrName("Developer ID", 25000);
    })
    it("shows button to open info and clicks", function () {
      return driver
        .waitByLinkOrName("Start", 25000)
        .click();
    });
  });
});
