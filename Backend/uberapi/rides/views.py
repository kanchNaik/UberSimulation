from rest_framework import viewsets, status
from rest_framework.response import Response
from django.core.cache import cache
from .models import Ride
from .serializers import RideSerializer


class RideViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting rides with caching.
    """
    queryset = Ride.objects.all()
    serializer_class = RideSerializer

    def list(self, request):
        """
        List all rides or filter by customer_id and/or driver_id with caching.
        """
        cache_key = 'rides_list'
        rides_data = cache.get(cache_key)

        if not rides_data:
            print("Cache miss for rides list.")  # Debug log
            customer_id = request.query_params.get('customer_id')
            driver_id = request.query_params.get('driver_id')

            queryset = Ride.objects.all()
            if customer_id:
                queryset = queryset.filter(customer__id=customer_id)
            if driver_id:
                queryset = queryset.filter(driver__id=driver_id)

            serializer = RideSerializer(queryset, many=True)
            rides_data = serializer.data
            cache.set(cache_key, rides_data, timeout=3600) 
        return Response(rides_data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single ride by its primary key with caching.
        """
        cache_key = f'ride_{pk}'
        ride_data = cache.get(cache_key)

        if not ride_data:
            print(f"Cache miss for ride {pk}.")  # Debug log
            try:
                ride = Ride.objects.get(pk=pk)
                serializer = RideSerializer(ride)
                ride_data = serializer.data
                cache.set(cache_key, ride_data, timeout=3600) 
            except Ride.DoesNotExist:
                return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(ride_data)

    def create(self, request):
        """
        Create a new ride and clear relevant caches.
        """
        serializer = RideSerializer(data=request.data)
        if serializer.is_valid():
            ride = serializer.save()

            # Clear the rides list cache
            cache.delete('rides_list')

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """
        Update an existing ride and clear relevant caches.
        """
        try:
            ride = Ride.objects.get(pk=pk)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RideSerializer(ride, data=request.data, partial=True)
        if serializer.is_valid():
            ride = serializer.save()

            # Clear the cache for this ride and the rides list
            cache.delete(f'ride_{pk}')
            cache.delete('rides_list')

            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        """
        Delete a ride by its primary key and clear relevant caches.
        """
        try:
            ride = Ride.objects.get(pk=pk)
            ride.delete()

            # Clear the cache for this ride and the rides list
            cache.delete(f'ride_{pk}')
            cache.delete('rides_list')

            return Response({"message": "Ride deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)
