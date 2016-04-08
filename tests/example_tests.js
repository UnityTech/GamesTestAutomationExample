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
  this.timeout(15000);
  var driver;
  var allPassed = true;
  var logType = "adbworkaround";
  var logFilterStr = new RegExp("^.\/" + process.env.APPIUM_APP_ACTIVITY);
  var logCatcher = new LogCatcher(logType, logFilterStr, driver);

  before(function () {
    require("./itest-niacin/appium-helpers.js").configureWd(wd);
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
    var coordinateObjects,
      birdObject;

    it("gets the message that game was started", function (done) {
      logCatcher
        .waitForMessage(/Game Started/, 25000, 100, function(entry){
          console.log("Got message '" + entry.message + "'");
          done();
        });
    });

    it("waits for items to populate", function(){
      return driver.sleep(3000)
    });

    it("gets the element coordinates", function(done){
      logCatcher
        .getJSONobjects(/Automation-coordinate/, function(coordObjects){
          coordinateObjects = coordObjects;
          coordObjects.length.should.be.above(10);
          done();
        });
    });

    it("stores coordinates of the bird-object", function(done){
      logCatcher.getJSONobject(/Automation-coordinate/, "Bird", function(birdObj){
        birdObject = birdObj;
        birdObject.name.should.be.equal("Bird");
        birdObject.x.should.be.above(0);
        birdObject.y.should.be.above(0);
        done();
      });
    });

    it("gets coordinates for start-button", function(done){
      logCatcher.getJSONobject(/Automation-coordinate/, "Start", function(startButton){
        startButton.name.should.be.equal("Start");
        startButton.x.should.be.above(0);
        startButton.y.should.be.above(0);
        done();
      });
    });

    it.skip("Still sees the bird at original position after 4 seconds", function(done){
      return driver
        .sleep(4000)
        .then(function(){
          console.log("Looking for bird");
          logCatcher.getJSONobject(/Automation-coordinate/, "Bird", function(birdObj){
            console.log("Birdobject.name = " + birdObj.name);
            birdObj.time.should.be.notEqual(birdObject.time);
            console.log("FU Birb!");
            birdObj.x.should.be.equal(birdObject.x);
            console.log("Something is fucky");
            birdObj.y.should.be.equal(birdObject.y);
            console.log("god damnit")
            done();
          });
        });
    });

    it("clicks the start-button", function(done){
      logCatcher.getJSONobject(/Automation-coordinate/, "Start", function(startButton){
        return driver
          .tapCoordLong(startButton.x, startButton.deviceY)
          .then(function(){
            console.log("Tapped at (" + startButton.x + ", " + startButton.deviceY + ")" );
            done();
        });
      });
    });

    it("reached the game", function(){
      return driver.sleep(3000);
    });

    it.skip("bird should have moved after 4 seconds", function(done){
      return driver
        .sleep(4000)
        .then(function(){
          logCatcher.getJSONobject(/Automation-coordinate/, "Bird", function(object){
            object.time.should.notEqual(birdObject.time);
            object.x.should.notEqual(birdObject.x);
            object.y.should.notEqual(birdObject.y);
          });
        });
    });
  });
});
