#!/usr/bin/env sh
set -eu

version="${1:-v0.1.1-rc.2}"
base="https://github.com/phemik-dev/HiveForge-Plugin-SDK/releases/download/$version"

npm install \
  "$base/hiveforge-plugin-contract-0.1.1-rc.2-recon0041.3.tgz" \
  "$base/hiveforge-plugin-host-0.1.1-rc.2.tgz" \
  "$base/hiveforge-plugin-work-fact-0.1.1-rc.2.tgz" \
  "$base/hiveforge-plugin-transport-file-0.1.1-rc.2.tgz" \
  "$base/hiveforge-plugin-sdk-0.1.1-rc.2.tgz" \
  "$base/hiveforge-plugin-example-transform-0.1.1-rc.2.tgz"
