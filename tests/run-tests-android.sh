#!/bin/bash

cd "$(dirname "$0")"
source test_start_helpers.sh
function get_full_path {
  echo "$( cd "$(dirname "$1")"; echo "$(pwd)/$(basename "$1")" )"
}

# Setup Appium
app_path='../example-app.apk'
export APPIUM_APPFILE=${APPIUM_APPFILE:="$(get_full_path "$app_path")"}
export APPIUM_DEVICE="Local Device"
export APPIUM_PLATFORM="android"

# Run adb once so API level can be read without the "daemon not running"-message
adb devices

APILEVEL=$(adb shell getprop ro.build.version.sdk)
APILEVEL="${APILEVEL//[$'\t\r\n']}"
export APILEVEL
echo "API level is: ${APILEVEL}"
export MOCHA_BIN='mocha'
TESTDROID=${TESTDROID:=0}

if [ "$TESTDROID" -eq "1" ]; then
  # We cannot install system wide, need to have relative path to mocha-binary
  npm install mocha
  echo "mocha executable: '$(file node_modules/.bin/mocha)'"
  MOCHA_BIN='./node_modules/.bin/mocha'
fi

if [ -z "$APILEVEL" ]; then
  echo "ERROR: Could not read android API-Level."
  echo "Exiting with failure before starting test!"
  exit 1
fi

if [ "$APILEVEL" -gt "18" ]; then
  echo "Setting APPIUM_AUTOMATION=android"
  export APPIUM_AUTOMATION="Android"
  export TEST="unity-ads.js"
else
  echo "Setting APPIUM_AUTOMATION=selendroid"
  export APPIUM_AUTOMATION="Selendroid"
  export TEST="unity-ads_android_legacy.js"
fi

if [ "$TESTDROID" -eq "1" ]; then
  npm install chai@2.1.2 colors underscore chai-as-promised wd path mkdirp yiewd tail mocha-junit-reporter mocha 2>&1
  ./node_modules/.bin/mocha example_tests.js --reporter mocha-junit-reporter --reporter-options mochaFile=./TEST-all.xml 2>&1
else
  npm install chai@2.1.2 colors underscore chai-as-promised wd path mkdirp yiewd tail mocha-junit-reporter mocha
  ./node_modules/.bin/mocha example_tests.js
fi


exit $scriptExitStatus
