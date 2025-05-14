#!/usr/bin/env bash

# Exit on error
set -o errexit

# Install GDAL dependencies 
apt-get update
apt-get install -y binutils libproj-dev gdal-bin python3-gdal

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run collectstatic if needed
# python manage.py collectstatic --noinput