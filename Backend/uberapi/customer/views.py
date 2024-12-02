from rest_framework.response import Response
from rest_framework import status, viewsets
from django.core.cache import cache  # Added for caching
from customer.models import Customer
from driver.models import Driver
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from geopy.distance import geodesic
from customer.serializers import CustomerRegistrationSerializer, CustomerListSerializer, CustomerSerializer, CustomerLocationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import AllowAny

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


    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authentication_classes(self):
        if self.action == 'create':
            return []
        return [JWTAuthentication()]

    def list(self, request, *args, **kwargs):
        """
        List all customers with caching.
        """
        # Added caching logic for the customer list
        cache_key = "customers_list"
        cached_data = cache.get(cache_key)

        if cached_data:  # Return cached data if available
            return Response(cached_data, status=status.HTTP_200_OK)

        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=300)  # Cache for 5 minutes
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single customer by ID with caching.
        """
        # Added caching logic for individual customer retrieval
        customer_id = kwargs.get('pk')
        cache_key = f"customer_{customer_id}"
        cached_data = cache.get(cache_key)

        if cached_data:  # Return cached data if available
            return Response(cached_data, status=status.HTTP_200_OK)

        customer = get_object_or_404(Customer, pk=customer_id)
        serializer = self.get_serializer(customer)
        cache.set(cache_key, serializer.data, timeout=300)  # Cache for 5 minutes
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
        Handles customer registration and invalidates the customer list cache.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            customer = serializer.save()
            cache.delete("customers_list")  # Invalidate customer list cache
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
        # Added cache invalidation logic for updated customers
        customer_id = kwargs.get('pk')
        partial = kwargs.pop('partial', False)
        customer = get_object_or_404(Customer, pk=customer_id)
        serializer = CustomerRegistrationSerializer(customer, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            cache.delete(f"customer_{customer_id}")  # Invalidate individual customer cache
            cache.delete("customers_list")  # Invalidate customer list cache
            return Response({"message": "Customer updated successfully!"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        Handles customer deletion and invalidates relevant caches.
        """
        # Added cache invalidation logic for deleted customers
        customer_id = kwargs.get('pk')
        customer = get_object_or_404(Customer, pk=customer_id)
        customer.user.delete()  # Deletes the related User as well
        customer.delete()
        cache.delete(f"customer_{customer_id}")  # Invalidate individual customer cache
        cache.delete("customers_list")  # Invalidate customer list cache
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
            cache.delete(f"customer_{customer.id}")  # Invalidate customer cache after updating location
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    @action(detail=True, methods=['get'], url_path='nearby-drivers')
    def drivers_nearby(self, request, pk=None):
        """
        Find nearby drivers for a customer within a 10-mile radius.
        """
        try:
            # Added caching for nearby drivers
            cache_key = f"nearby_drivers_{pk}"
            cached_data = cache.get(cache_key)

            if cached_data:  # Return cached data if available
                return Response(cached_data, status=status.HTTP_200_OK)

            customer = Customer.objects.get(id=pk)
            
            
            print(customer)

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

            serializer = NearbyDriverSerializer(nearby_drivers, many=True)
            cache.set(cache_key, serializer.data, timeout=300)  # Cache for 5 minutes
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=404)
