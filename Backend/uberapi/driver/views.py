from rest_framework import status, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from .models import Driver, Vehicle
from .serializers import DriverRegistrationSerializer, DriverListSerializer, \
    DriverLocationSerializer, NearbyDriverSerializer, DriverIntroVideoSerializer

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
        elif self.action == 'set_location':
            return DriverLocationSerializer
        elif self.action == 'nearby_drivers':
            return NearbyDriverSerializer
        elif self.action == 'upload_intro_video':
            return DriverIntroVideoSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        """
        List all drivers.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single driver by ID.
        """
        driver = get_object_or_404(Driver, pk=kwargs.get('pk'))
        serializer = self.get_serializer(driver)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Handles driver registration.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            driver = serializer.save()
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
        Handles both PUT (full update) and PATCH (partial update).
        """
        partial = kwargs.pop('partial', False)
        driver = get_object_or_404(Driver, pk=kwargs.get('pk'))
        serializer = DriverRegistrationSerializer(driver, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Driver updated successfully!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Handles driver deletion.
        """
        driver = get_object_or_404(Driver, pk=kwargs.get('pk'))
        driver.user.delete()  # Deletes the related User as well
        driver.delete()
        return Response({"message": "Driver deleted successfully!"}, status=status.HTTP_200_OK)
    

    @action(detail=True, methods=['put'], url_path='set-location')
    def set_location(self, request, pk=None):
        """
        Custom action to set the latitude and longitude of a customer.
        """
        try:
            driver = self.get_object()
        except Driver.DoesNotExist:
            return Response({"error": "Driver not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = DriverLocationSerializer(driver, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='search')
    def search_drivers(self, request):
        """
        Search for drivers based on any combination of attributes.
        """
        # Get query parameters
        filters = {}
        allowed_fields = [
            'user__username', 'user__email', 'first_name', 'last_name', 
            'phone_number', 'address', 'city', 'state', 'zip_code', 
            'license_number', 'rating', 'is_available'
        ]

        for field in allowed_fields:
            value = request.query_params.get(field)
            if value:
                # Build a filter for the query
                filters[field] = value

        if not filters:
            return Response({"error": "No filters provided."}, status=400)

        # Query the database with the filters
        drivers = Driver.objects.filter(**filters)

        # Serialize and return the results
        serializer = DriverListSerializer(drivers, many=True)
        return Response(serializer.data, status=200)
    
    @action(detail=True, methods=['post'], url_path='upload-video')
    def upload_intro_video(self, request, pk=None):
        """
        API to upload an introductory video for a driver.
        """
        try:
            # Get the driver object
            driver = self.get_object()

            # Serialize and validate the data
            serializer = self.get_serializer(driver, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=200)
            return Response(serializer.errors, status=400)

        except Driver.DoesNotExist:
            return Response({"error": "Driver not found."}, status=404)
    

    



