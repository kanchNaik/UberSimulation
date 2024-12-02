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
from driver.serializers import NearbyDriverSerializer
from django.db import transaction
from accounts.models import User
from rest_framework.pagination import PageNumberPagination

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.select_related('user')  # Eager load User data
    serializer_class = CustomerSerializer

    def get_serializer_class(self):
        """
        Dynamically switch serializer classes based on the action.
        """
        if self.action == 'create' or self.action == 'bulk_register':
            return CustomerRegistrationSerializer
        elif self.action in ['list', 'retrieve']:
            return CustomerListSerializer
        return super().get_serializer_class()


    # def get_permissions(self):
    #     if self.action == 'create' or self.action == 'list' or self.action == 'bulk_register':
    #         return [AllowAny()]
    #     return [IsAuthenticated()]

    # def get_authentication_classes(self):
    #     if self.action == 'create' or self.action == 'list' or self.action == 'bulk_register':
    #         return []
    #     return [JWTAuthentication()]
    permission_classes = [AllowAny]
    def list(self, request, *args, **kwargs):
        """
        List all customers with caching and pagination.
        """
        # Use the page number as part of the cache key
        page_number = request.query_params.get('page', 1)
        cache_key = f"customers_list_page_{page_number}"
        cached_data = cache.get(cache_key)

        if cached_data:  # Return cached data if available
            return Response(cached_data, status=status.HTTP_200_OK)

        queryset = self.filter_queryset(self.get_queryset())
        paginator = PageNumberPagination()
        paginator.page_size = 10  # You can set this dynamically or in settings
        paginated_queryset = paginator.paginate_queryset(queryset, request)

        serializer = self.get_serializer(paginated_queryset, many=True)
        cache.set(cache_key, serializer.data, timeout=300)  # Cache for 5 minutes
        return paginator.get_paginated_response(serializer.data)

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
            #cache.delete("customers_list")  # Invalidate customer list cache
            keys_to_invalidate = cache.keys("customers_list_page_*")
            for key in keys_to_invalidate:
                cache.delete(key)

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
            #cache.delete("customers_list")  # Invalidate customer list cache
            keys_to_invalidate = cache.keys("customers_list_page_*")
            for key in keys_to_invalidate:
                cache.delete(key)

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
        #cache.delete("customers_list")  # Invalidate customer list cache
        keys_to_invalidate = cache.keys("customers_list_page_*")
        for key in keys_to_invalidate:
            cache.delete(key)

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
        
    @action(detail=False, methods=["post"], url_path="bulk-register")
    def bulk_register(self, request, *args, **kwargs):
        """
        Handles bulk customer registration using bulk_create.
        """
        customers_data = request.data

        # Validate input is a list
        if not isinstance(customers_data, list):
            return Response(
                {"error": "Input must be a list of customer objects."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prepare a list of user and customer objects
        # Prepare a list of user and customer objects
        customers_to_create = []
        users_to_create = []
        errors = []

        for customer_data in customers_data:
            # Initialize the serializer
            serializer = self.get_serializer(data=customer_data)
            if serializer.is_valid():
                customer_data_valid = serializer.validated_data

                # Extract user-specific fields
                username = customer_data_valid.get("username")
                email = customer_data_valid.get("email")
                password = customer_data_valid.get("password")

                # Ensure username, email, and password are present
                if not username or not email or not password:
                    errors.append({"data": customer_data, "error": "Username, email, and password are required."})
                    continue

                # Create the User object
                user = User(username=username, email=email)
                user.set_password(password)  # Set password correctly
                users_to_create.append(user)

                # Create the Customer object but don't save it yet
                customer_data_valid.pop("username", None)  # Remove user-specific fields
                customer_data_valid.pop("email", None)
                customer_data_valid.pop("password", None)
                customer = Customer(user=user, **customer_data_valid)
                customer.id = customer.generate_ssn_id()
                customers_to_create.append(customer)

            else:
                errors.append({"data": customer_data, "errors": serializer.errors})

        # If any validation errors occurred, return them
        if errors:
            return Response(
                {"error": "Validation errors occurred.", "details": errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Bulk insert the users and customers in one go
        with transaction.atomic():
            # Save users first
            for user in users_to_create:
                user.save()  # Save each user to ensure correct primary key assignment
            
            # Bulk insert customers without specifying primary keys
            Customer.objects.bulk_create(customers_to_create)
            keys_to_invalidate = cache.keys("customers_list_page_*")
            for key in keys_to_invalidate:
                cache.delete(key)

        return Response(
            {
                "message": f"Successfully registered {len(customers_to_create)} customers.",
            },
            status=status.HTTP_201_CREATED,
        )