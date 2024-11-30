from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'', LoginViewSet, basename='login')  # The prefix is empty, so it's under `api/customers/`

urlpatterns = [
    path('', include(router.urls)), 
]
