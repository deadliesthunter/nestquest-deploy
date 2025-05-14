#!/usr/bin/env bash
# build.sh

# Install GDAL dependencies (Ubuntu-based Render environment)
sudo apt-get update
sudo apt-get install -y binutils libproj-dev gdal-bin python3-gdal

# Install Python dependencies
pip install -r requirements.txt