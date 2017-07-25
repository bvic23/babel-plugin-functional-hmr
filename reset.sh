#!/bin/sh
DIR="$( cd "$( dirname "$0" )" && pwd )"
cd $DIR
rm -rf node_modules/
yarn install

