import os
import platform
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

# First, check for paths directly set by environment variables
GDAL_LIBRARY_PATH = os.environ.get('GDAL_LIBRARY_PATH')
GEOS_LIBRARY_PATH = os.environ.get('GEOS_LIBRARY_PATH')

# If not set, try to auto-detect
if not GDAL_LIBRARY_PATH or not GEOS_LIBRARY_PATH:
    # Check if we're on Render
    if os.environ.get('RENDER') or platform.system() != 'Darwin':
        # We're on Render or another Linux environment
        
        # Try to import the auto-generated paths
        try:
            from server.settings.gdal_paths import *
            logger.info(f"Loaded GDAL settings from auto-generated file: {GDAL_LIBRARY_PATH}")
        except ImportError:
            # Try standard Linux paths
            linux_gdal_paths = [
                '/usr/lib/libgdal.so',
                '/usr/lib/x86_64-linux-gnu/libgdal.so',
            ]
            
            linux_geos_paths = [
                '/usr/lib/libgeos_c.so',
                '/usr/lib/x86_64-linux-gnu/libgeos_c.so',
            ]
            
            # Set the first one that exists
            for path in linux_gdal_paths:
                if os.path.exists(path):
                    GDAL_LIBRARY_PATH = path
                    break
                    
            for path in linux_geos_paths:
                if os.path.exists(path):
                    GEOS_LIBRARY_PATH = path
                    break
    else:
        # We're on macOS (local development)
        GDAL_LIBRARY_PATH = '/opt/homebrew/lib/libgdal.dylib'
        GEOS_LIBRARY_PATH = '/opt/homebrew/lib/libgeos_c.dylib'

# Log what we're using
logger.info(f"GDAL_LIBRARY_PATH: {GDAL_LIBRARY_PATH}")
logger.info(f"GEOS_LIBRARY_PATH: {GEOS_LIBRARY_PATH}")