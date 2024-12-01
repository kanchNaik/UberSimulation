from rest_framework import status, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from .models import Driver
from .serializers import DriverRegistrationSerializer, DriverListSerializer


class DriverViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations for Driver.
    """
    queryset = Driver.objects.all()

    def get_serializer_class(self):
        """
        Dynamically switch serializer classes based on the action.
        """
        if self.action == 'create':
            return DriverRegistrationSerializer
        elif self.action in ['list', 'retrieve']:
            return DriverListSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        """
        List all drivers with caching.
        """
        cache_key = 'drivers_list'
        drivers_data = cache.get(cache_key)  # Try fetching from cache
        if not drivers_data:
            print("Cache miss for drivers list.")  # Debugging log
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            drivers_data = serializer.data
            cache.set(cache_key, drivers_data, timeout=3600)
        return Response(drivers_data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single driver by ID with caching.
        """
        driver_id = kwargs.get('pk')
        cache_key = f'driver_{driver_id}'
        driver_data = cache.get(cache_key) 
        if not driver_data:
            print(f"Cache miss for driver {driver_id}.")  # Debugging log
            driver = get_object_or_404(Driver, pk=driver_id)
            serializer = self.get_serializer(driver)
            driver_data = serializer.data
            cache.set(cache_key, driver_data, timeout=3600)  
        return Response(driver_data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Handles driver registration and clears relevant caches.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            driver = serializer.save()
            # Clear the drivers list cache
            cache.delete('drivers_list')
            return Response(
                {
                    "message": "Driver registered successfully!",
                    "user_id": driver.user.id,
                    "driver_id": driver.id
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Handles both PUT (full update) and PATCH (partial update) and clears relevant caches.
        """
        partial = kwargs.pop('partial', False)
        driver = get_object_or_404(Driver, pk=kwargs.get('pk'))
        serializer = DriverRegistrationSerializer(driver, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            # Clear the specific driver cache and the list cache
            cache_key = f'driver_{kwargs.get("pk")}'
            cache.delete(cache_key)
            cache.delete('drivers_list')
            return Response({"message": "Driver updated successfully!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Handles driver deletion and clears relevant caches.
        """
        driver = get_object_or_404(Driver, pk=kwargs.get('pk'))
        driver.user.delete()  # Deletes the related User as well
        driver.delete()
        # Clear the specific driver cache and the list cache
        cache_key = f'driver_{kwargs.get("pk")}'
        cache.delete(cache_key)
        cache.delete('drivers_list')
        return Response({"message": "Driver deleted successfully!"}, status=status.HTTP_200_OK)
