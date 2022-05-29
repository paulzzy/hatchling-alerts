#!/bin/bash
#
# Assumes a macOS environment

echo "Building Firefox extension"

BUILD_DES=build/firefox/

mkdir -p              $BUILD_DES

echo "Copying icons"

cp -R icons           $BUILD_DES/

echo "Copying libraries"

cp -R lib/            $BUILD_DES/

echo "Copying common files"

cp src/*.js           $BUILD_DES/

echo "Copying Firefox-specific files"

cp src/firefox/*.html $BUILD_DES/
cp src/firefox/*.js   $BUILD_DES/
cp src/firefox/*.json $BUILD_DES/

echo "Finished building Firefox extension"
