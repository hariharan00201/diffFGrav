#!/usr/bin/env bash

mkdir -pv web

rm -f -r -v web/*

cp -r -v docs/* web/
cp -r -v docs/* web/
cp -r -v src/main/* web/
cp -r -v src/test/* web/
cp -r -v src/test/resources/collapsed web/
cp -r -v src/test/resources/events web/


