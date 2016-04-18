#!/usr/bin/env bash

pkill node

node ./server/server.js &

sleep 1

node ./client/client.js &
node ./client/client.js &
node ./client/client.js &
node ./client/client.js &
node ./client/client.js