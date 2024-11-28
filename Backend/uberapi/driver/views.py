from rest_framework import status, viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Driver, Vehicle
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
