export TEST_RUNNING_FILE="$(mktemp)"

# ping_to_logcat
# Will make device ping the host given as argument and ouput result live
# in logcat. Will do pinging in blocks of 10 pings and stop if stop_ping_to_logcat()
# is called. Will return instantly and do pingin in subshell.
# Args:
# $1 host_to_ping
function ping_to_logcat {
  MINIMUM_LOOP_TIME=5
  PINGS_IN_BLOCK=10
  touch "${TEST_RUNNING_FILE:?}"
  (
    while [ -f "${TEST_RUNNING_FILE:?}" ]
    do
      date_at_start=$(date +%s)
      adb shell "ping -c${PINGS_IN_BLOCK} $1 |while read line ; do log -pd -tQApinger \$line ; done"
      # Avoid looping out of control if something fails
      if [ "$(( date_at_start + MINIMUM_LOOP_TIME))" -gt "$(date +%s)" ]; then
        echo "Looping too fast, probably something failed. Throttling"
        sleep 5
      fi
    done
  ) &
}

# stop_ping_to_logcat
# Stops the logging of pings to logcat. See ping_to_logcat()
# Args:
# None
function stop_ping_to_logcat {
  echo "stopping pinger, removing ${TEST_RUNNING_FILE}"
  rm "${TEST_RUNNING_FILE:?}"
}
