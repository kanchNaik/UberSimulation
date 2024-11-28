from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DriverViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', DriverViewSet, basename='driver')  # The prefix is empty, so it's under `api/customers/`

# Include router URLs
urlpatterns = [
    path('', include(router.urls)),  # This ensures the router's URLs are appended under `api/customers/`
]
