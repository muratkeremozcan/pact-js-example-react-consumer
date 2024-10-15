#!/bin/bash

# Load environment variables
. ./scripts/env-setup.sh

# Publish pacts to the broker
pact-broker publish ./pacts \
    --consumer-app-version=$GITHUB_SHA \
    --branch=$GITHUB_BRANCH \
    --broker-base-url=$PACT_BROKER_BASE_URL \
    --broker-token=$PACT_BROKER_TOKEN