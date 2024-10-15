#!/bin/bash

# Load environment variables
. ./scripts/env-setup.sh

# Check if the ReactConsumer can be deployed
pact-broker can-i-deploy \
    --pacticipant ReactConsumer \
    --version=$GITHUB_SHA \
    --to-environment dev \
    --retry-while-unknown=10
