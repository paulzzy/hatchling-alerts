#!/bin/bash
#
# Assumes a macOS environment

echo "Building Chromium extension"

BUILD_DES=build/chromium/

mkdir -p              $BUILD_DES

echo "Copying icons"

cp -R icons           $BUILD_DES/

echo "Copying libraries"

cp -R lib/            $BUILD_DES/

echo "Copying common files"

cp src/*.js           $BUILD_DES/

echo "Copying Chromium-specific files"

cp src/chromium/*.js   $BUILD_DES/
cp src/chromium/*.json $BUILD_DES/

echo "Finished building Chromium extension"
