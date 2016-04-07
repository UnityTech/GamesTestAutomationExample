#!/bin/bash
# Helpers for commandline scripts related to appium tests.

source "logcat_pinger.sh"

# Take a screenshot from connected android device into a child-folder named 'screenshots'
# Arg1: screenshot filename
function take_screenshot {
  adb shell screencap -p "/sdcard/screencap.png" &&
  adb pull "/sdcard/screencap.png" &&
  mkdir "screenshots"
  mv screencap.png "screenshots/$1"
}

# Take $1 screenshots and save them to file ${2}[0..n].png. The files will then
# need to be pulled using pull_screenshot_batch
function batch_screenshot {
  _PREFIX="screencap"

  if [ "$2" != "" ]; then
    _PREFIX=$2
  fi

  for (( i=0; i < $1; ++i ))
  do
    adb shell screencap -p "/sdcard/${_PREFIX}${i}.png"
  done
}

# Pull $1 screenshots from device and save them to local dir screenshots/. The
# naming convention and ordering of the files is determined in the same way as
# when executing burst_screenshot.
function pull_screenshot_batch {
  _PREFIX="screencap"

  if [ "$2" != "" ]; then
    _PREFIX=$2
  fi

  mkdir "screenshots"

  for (( i=0; i < $1; ++i ))
  do
    adb pull "/sdcard/${_PREFIX}${i}.png"
    mv ${_PREFIX}${i}.png "screenshots/${_PREFIX}${i}.png"
  done
}

function get_full_path {
  echo "$( cd "$(dirname "$1")"; echo "$(pwd)/$(basename "$1")" )"
}

function android_reboot_and_wait_for_device_ready {
  echo "Rebooting android device"
  adb reboot
  sleep 5
  adb wait-for-device
  while [ -z "$(adb shell getprop sys.boot_completed | tr -d '\r')" ]; do
    sleep 1
    printf "_"
  done
  until [ "$(adb shell getprop sys.boot_completed | tr -d '\r')" -eq 1 ]; do
    sleep 1
    print "."
  done
  echo
  echo "Rebooted"
}

function get_android_device_name {
  adb devices 1>&2
  adb wait-for-device 1>&2 & pid=$!
  export ADB_WAIT_DEVICE_PID=$pid
  (bash -c "sleep 10 ; kill $ADB_WAIT_DEVICE_PID") > /dev/null & disown
  wait $ADB_WAIT_DEVICE_PID
  phone_name="$(adb shell getprop ro.product.manufacturer | tr -d '[[:space:]]')-$(adb shell getprop ro.product.model | tr -d '[[:space:]]')" 1>&2
  phone_name=${phone_name:='no_droid_device_found'}
  if [ "$TESTDROID" == "1" ]; then
    echo "TD-$phone_name"
  else
    echo "$phone_name"
  fi
}

function get_ios_device_name {
  phone_name=$(idevicename |tr -d '[[:space:]]' |sed -e 's/[^A-Za-z0-9\-_]//g')
  phone_name=${phone_name:='no_iOS_device_found'}
  if [ "$TESTDROID" == "1" ]; then
    echo "TD-$phone_name"
  else
    echo "$phone_name"
  fi
}

function start_script {
  npm_libraries="chai@2.1.2 colors underscore chai-as-promised wd path mkdirp yiewd tail mocha mocha-jenkins-reporter"
  if [ ! $(sudo -n 'echo "can i sudo"' ; echo "$?") ]; then
    echo "Run npm Locally using sudo"
    sudo rm -rf /home/ubuntu/.npm 2>&1
    sudo -n npm install $npm_libraries 2>&1
  else
    echo "Run npm Locally"
    npm install $npm_libraries 2>&1
  fi

  echo "mocha executable: '$(file node_modules/.bin/mocha)'"
  MOCHA_BIN='./node_modules/.bin/mocha'
  if [ ! -f "$MOCHA_BIN" ]; then
    if [ $(which mocha) ]; then
      echo "Using system wide install of mocha"
      MOCHA_BIN='mocha'
    else
      echo "Trying to install mocha globally if we have passwordless sudo"
      rm -rf node_modules 2>&1
      sudo -n npm install $npm_libraries 2>&1
      MOCHA_BIN='./node_modules/.bin/mocha'
      if [ ! $(which "$MOCHA_BIN") ]; then
        echo "Still no mocha, giving up!"
        exit 102
      fi
    fi
  fi

  echo "Running tests '$TEST'"
  if [ "$TESTDROID" == "1" ]; then
    export JUNIT_REPORT_STACK=1
    export JUNIT_REPORT_PATH="TEST-all.xml"
    JUNIT_REPORT_NAME="$DEVICE_NAME"
    JUNIT_REPORT_NAME=${JUNIT_REPORT_NAME:="No Device Name Set"}
    export JUNIT_REPORT_NAME
    ${MOCHA_BIN} "${TEST}" --reporter mocha-jenkins-reporter 2>&1
  else
    ${MOCHA_BIN} "$TEST"
  fi
  return $?
}
