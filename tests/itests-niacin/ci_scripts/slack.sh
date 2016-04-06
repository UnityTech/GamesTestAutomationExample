#!/bin/bash

# Set following env variables before calling script:
#SLACK_CHANNEL
#SLACK_USERNAME
#SLACK_WEBHOOK
#SLACK_MESSAGE
#SLACK_STATUS_ICON
# ICON_OK=":vaultboy:"
# ICON_WARNING=":warning:"
# ICON_INFO=":info:"
# ICON_ERROR=":error:"

ICON=":jenkins:"
message="${SLACK_STATUS_ICON} $SLACK_MESSAGE"
data="payload={\"channel\": \"${SLACK_CHANNEL}\", \
               \"username\": \"${SLACK_USERNAME}\", \
               \"text\": \"$message\", \
               \"icon_emoji\": \"$ICON\"}"
curl -X POST --data-urlencode "$data" "$SLACK_WEBHOOK"
