"""
WSGI config for server project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os
import sys

# Set GDAL paths before anything else loads
# This follows Azure App Service best practices for GeoDjango
if os.environ.get('RENDER'):
    # Try loading GDAL paths from environment
    gdal_library_path = os.environ.get('GDAL_LIBRARY_PATH')
    geos_library_path = os.environ.get('GEOS_LIBRARY_PATH')
    
    # If not in environment, try to find them
    if not gdal_library_path:
        # Look for common Linux paths
        for path in [
            '/usr/lib/libgdal.so',
            '/usr/lib/x86_64-linux-gnu/libgdal.so',
        ]:
            if os.path.exists(path):
                gdal_library_path = path
                break
    
    if not geos_library_path:
        # Look for common Linux paths
        for path in [
            '/usr/lib/libgeos_c.so',
            '/usr/lib/x86_64-linux-gnu/libgeos_c.so',
        ]:
            if os.path.exists(path):
                geos_library_path = path
                break
    
    # Set environment variables for Django
    if gdal_library_path:
        os.environ['GDAL_LIBRARY_PATH'] = gdal_library_path
    if geos_library_path:
        os.environ['GEOS_LIBRARY_PATH'] = geos_library_path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
