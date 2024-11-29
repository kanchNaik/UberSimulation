from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Ride
from .serializers import RideSerializer

class RideViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing, creating, updating, and deleting rides.
    """
    queryset = Ride.objects.all()
    serializer_class = RideSerializer

    def list(self, request):
        """
        List all rides or filter by customer_id and/or driver_id.
        """
        customer_id = request.query_params.get('customer_id')
        driver_id = request.query_params.get('driver_id')

        queryset = Ride.objects.all()
        if customer_id:
            queryset = queryset.filter(customer__id=customer_id)
        if driver_id:
            queryset = queryset.filter(driver__id=driver_id)

        serializer = RideSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        """
        Retrieve a single ride by its primary key.
        """
        try:
            ride = Ride.objects.get(pk=pk)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RideSerializer(ride)
        return Response(serializer.data)

    def create(self, request):
        """
        Create a new ride.
        """
        serializer = RideSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        """
        Update an existing ride. Supports both PUT (full update) and PATCH (partial update).
        """
        try:
            ride = Ride.objects.get(pk=pk)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RideSerializer(ride, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def destroy(self, request, pk=None):
        """
        Delete a ride by its primary key.
        """
        try:
            ride = Ride.objects.get(pk=pk)
        except Ride.DoesNotExist:
            return Response({"error": "Ride not found"}, status=status.HTTP_404_NOT_FOUND)

        ride.delete()
        return Response({"message": "Ride deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
