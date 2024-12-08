# Backend/uberapi/uberapi/asgi.py
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from .routing import application as channels_application
from channels.layers import get_channel_layer
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'uberapi.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": channels_application,  # Use the application from routing.py
})

channel_layer = get_channel_layer()