from rest_framework.response import Response
from rest_framework import status, viewsets
from customer.models import Customer
from driver.models import Driver
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from geopy.distance import geodesic
from customer.serializers import CustomerRegistrationSerializer, CustomerListSerializer, CustomerSerializer, CustomerLocationSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_serializer_class(self):
        """
        Dynamically switch serializer classes based on the action.
        """
        if self.action == 'create':
            return CustomerRegistrationSerializer
        elif self.action in ['list', 'retrieve']:
            return CustomerListSerializer
        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        """
        List all customers.
        """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single customer by ID.
        """
        customer = get_object_or_404(Customer, pk=kwargs.get('pk'))
        serializer = self.get_serializer(customer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Handles customer registration.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            customer = serializer.save()
            return Response(
                {
                    "message": "Customer registered successfully!",
                    "user_id": customer.user.id,
                    "customer_id": customer.id
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Handles both PUT (full update) and PATCH (partial update).
        """
        partial = kwargs.pop('partial', False)
        customer = get_object_or_404(Customer, pk=kwargs.get('pk'))
        serializer = CustomerRegistrationSerializer(customer, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Customer updated successfully!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Handles customer deletion.
        """
        customer = get_object_or_404(Customer, pk=kwargs.get('pk'))
        customer.user.delete()  # Deletes the related User as well
        customer.delete()
        return Response({"message": "Customer deleted successfully!"}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['put'], url_path='set-location')
    def set_location(self, request, pk=None):
        """
        Custom action to set the latitude and longitude of a customer.
        """
        try:
            customer = self.get_object()
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerLocationSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=True, methods=['get'], url_path='nearby-drivers')
    def drivers_nearby(self, request, pk=None):
        try:
            # Get the customer object
            customer = Customer.objects.get(id=pk)
            
            print(customer)
            if not customer.latitude or not customer.longitude:
                return Response({"error": "Customer location is not set."}, status=400)

            customer_location = (customer.latitude, customer.longitude)

            # Find drivers within a 10-mile radius
            drivers = Driver.objects.filter(is_available=True)
            nearby_drivers = []

            for driver in drivers:
                driver_location = (driver.latitude, driver.longitude)
                distance = geodesic(customer_location, driver_location).miles

                if distance <= 10:
                    nearby_drivers.append(driver)

            # Serialize and return the results
            serializer = NearbyDriverSerializer(nearby_drivers, many=True)
            return Response(serializer.data)

        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=404)
