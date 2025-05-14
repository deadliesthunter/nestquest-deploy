#!/usr/bin/env bash
set -o errexit

# Install system dependencies
apt-get update
apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    libgeos-dev

# Explicitly set GDAL paths for Linux
export GDAL_LIBRARY_PATH=/usr/lib/libgdal.so
export GEOS_LIBRARY_PATH=/usr/lib/libgeos_c.so

pip install -r requirements.txt