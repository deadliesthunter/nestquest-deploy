import os
import platform

# Determine whether we're on Render.com (Linux) or local dev (macOS)
if os.environ.get('RENDER') or platform.system() == 'Linux':
    # Render.com - Linux paths
    GDAL_LIBRARY_PATH = '/usr/lib/x86_64-linux-gnu/libgdal.so'
    GEOS_LIBRARY_PATH = '/usr/lib/x86_64-linux-gnu/libgeos_c.so'
    
    # Fallbacks if the specific paths don't work
    if not os.path.exists(GDAL_LIBRARY_PATH):
        GDAL_LIBRARY_PATH = '/usr/lib/libgdal.so'
    
    if not os.path.exists(GEOS_LIBRARY_PATH):
        GEOS_LIBRARY_PATH = '/usr/lib/libgeos_c.so'
else:
    # Local macOS paths
    GDAL_LIBRARY_PATH = '/opt/homebrew/lib/libgdal.dylib'
    GEOS_LIBRARY_PATH = '/opt/homebrew/lib/libgeos_c.dylib'