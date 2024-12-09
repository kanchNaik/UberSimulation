from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RideViewSet, RideEventImageViewSet, ReviewViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', RideViewSet, basename='rides')  # The prefix is empty, so it's under `api/customers/`
router.register(r'images', RideEventImageViewSet, basename='rideeventimage')
router.register(r'reviews', ReviewViewSet, basename='reviews')
# Include router URLs
urlpatterns = [
    path('', include(router.urls)),  # This ensures the router's URLs are appended under `api/customers/`
]