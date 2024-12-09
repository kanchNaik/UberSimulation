from rest_framework.response import Response
from rest_framework import status, viewsets
from customer.models import Customer, PaymentMethod
from driver.models import Driver
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from geopy.distance import geodesic
from customer.serializers import CustomerRegistrationSerializer, CustomerListSerializer, CustomerSerializer,\
CustomerLocationSerializer, PaymentMethodSerializer, CustomerImageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import authentication_classes, permission_classes, parser_classes
from rest_framework.permissions import AllowAny
from driver.serializers import NearbyDriverSerializer
from rest_framework.parsers import MultiPartParser, FormParser

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
        if self.action == 'create' or self.action == 'list':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_authentication_classes(self):
        if self.action == 'create' or self.action == 'list':
            return []
        return [JWTAuthentication()]
    
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
        Only available for admin users or the customer themselves.
        """
        partial = kwargs.pop('partial', False)
        customer = get_object_or_404(Customer, pk=kwargs.get('pk'))

        # Check if the user is an admin or the customer themselves
        if not (request.user.is_staff or request.user == customer.user):  # Assuming `Customer` has a `user` field
            return Response({"detail": "You do not have permission to perform this action."},
                            status=status.HTTP_403_FORBIDDEN)

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
        

    @action(detail=False, methods=['get'], url_path='search')
    def search_customers(self, request):
        # Get query parameters
        params = request.GET
        queryset = Customer.objects.all()

        # Apply filters
        if 'first_name' in params:
            queryset = queryset.filter(first_name__icontains=params['first_name'])
        if 'city' in params:
            queryset = queryset.filter(city__icontains=params['city'])
        if 'state' in params:
            queryset = queryset.filter(state__icontains=params['state'])
        if 'zip_code' in params:
            queryset = queryset.filter(zip_code__icontains=params['zip_code'])

        # Serialize the queryset
        serialized_customers = CustomerSerializer(queryset, many=True)
        return Response(serialized_customers.data)

    @action(detail=True, methods=['get'], url_path='payment-methods')
    def payment_methods(self, request, pk=None):
        """Get all payment methods for a customer"""
        customer = self.get_object()
        payment_methods = customer.payment_methods.all()
        serializer = PaymentMethodSerializer(payment_methods, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'], url_path='payment-methods')
    def add_payment_method(self, request, pk=None):
        """Add a new payment method for a customer"""
        customer = self.get_object()
        serializer = PaymentMethodSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(customer=customer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['DELETE'], url_path='payment-methods/(?P<payment_id>[^/.]+)')
    def delete_payment_method(self, request, pk=None, payment_id=None):
        """Delete a specific payment method"""
        customer = self.get_object()
        try:
            payment_method = customer.payment_methods.get(id=payment_id)
            payment_method.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except PaymentMethod.DoesNotExist:
            return Response(
                {"error": "Payment method not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['PATCH'], url_path='payment-methods/(?P<payment_id>[^/.]+)/set-default')
    def set_default_payment_method(self, request, pk=None, payment_id=None):
        """Set a payment method as default"""
        customer = self.get_object()
        try:
            payment_method = customer.payment_methods.get(id=payment_id)
            payment_method.is_default = True
            payment_method.save()
            return Response(PaymentMethodSerializer(payment_method).data)
        except PaymentMethod.DoesNotExist:
            return Response(
                {"error": "Payment method not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )


    @action(detail=True, methods=['patch'], url_path='upload-image')
    @parser_classes([MultiPartParser, FormParser])
    def upload_driver_image(self, request, pk=None):
        try:
            customer = self.get_object()
        except Customer.DoesNotExist:
            return Response({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerImageSerializer(customer, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)