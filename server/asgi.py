import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from Login.routing import websocket_urlpatterns

# Set the default Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

# Get the ASGI application
django_asgi_app = get_asgi_application()

# Define the application protocol type router
application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
        ),
    }
)
