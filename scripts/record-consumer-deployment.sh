#!/bin/bash

# Load environment variables
. ./scripts/env-setup.sh

# Record consumer deployment for the main branch
if [ "$GITHUB_BRANCH" = "main" ]; then
  pact-broker record-deployment \
    --pacticipant ReactConsumer \
    --version $GITHUB_SHA \
    --environment $npm_config_env
fi
