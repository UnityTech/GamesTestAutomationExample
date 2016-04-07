#!/bin/bash

# There seems to be some path issues in the post-build action plugin...
echo "PATH was '${PATH}'"
jq_path="/usr/local/bin"
if [ -d "$jq_path" ] && [[ ":$PATH:" != *":$jq_path:"* ]]; then
	PATH="${PATH:+"$PATH:"}$jq_path"
fi

echo "PATH is '${PATH}'"

jenkins_results_address="${BUILD_URL}testReport/api/json"
curl "$jenkins_results_address" > results.txt
which jq
failCount=$(jq ".failCount" results.txt)
passCount=$(jq ".passCount" results.txt)
skipCount=$(jq ".skipCount" results.txt)

if [ "$failCount" != "0" ]; then
	export SLACK_STATUS_ICON=":warning:"
else 
	export SLACK_STATUS_ICON=":vaultboy:"
fi

if [ "$passCount" == "0" ]; then
	export SLACK_STATUS_ICON=":warning:"
fi

export SLACK_MESSAGE="$JOB_NAME results: Passed: $passCount, Failed: $failCount, skipped: $skipCount. Results at: $BUILD_URL"
./slack.sh
