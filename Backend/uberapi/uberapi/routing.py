# Backend/uberapi/uberapi/routing.py
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from .consumers import KafkaConsumer

websocket_urlpatterns = [
    path("ws/drivers/", KafkaConsumer.as_asgi()),  # Define WebSocket routes here
]

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})