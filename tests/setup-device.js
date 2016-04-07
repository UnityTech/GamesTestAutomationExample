var
  wd = require("wd"),
  chai = require("chai"),
  mkdirp = require("mkdirp"),
  chaiAsPromised = require("chai-as-promised");

require('colors');

// Create folder to store device screenshots if does not exist
mkdirp('screenshots');

exports.serverConfig = {
  host: 'localhost',
  port: 4723,
  path: '/wd/hub'
};

exports.desired = {
  app: process.env.APPIUM_APPFILE,
  automationName: process.env.APPIUM_AUTOMATION,
  deviceName: process.env.APPIUM_DEVICE,
  platformName: process.env.APPIUM_PLATFORM
};

chai.use(chaiAsPromised);
exports.should = chai.should();

chaiAsPromised.transferPromiseness = wd.transferPromiseness;
