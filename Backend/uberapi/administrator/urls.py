from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdministratorViewSet, StatisticsView

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', AdministratorViewSet, basename='administrator')  # The prefix is empty, so it's under `api/customers/`
router.register(r'statistics', StatisticsView, basename='statistics')

# Include router URLs
urlpatterns = [
    path('', include(router.urls)),  # This ensures the router's URLs are appended under `api/customers/`
]
