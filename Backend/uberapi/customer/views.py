from rest_framework.response import Response
from rest_framework import status, viewsets
from customer.models import Customer
from django.shortcuts import get_object_or_404
from customer.serializers import CustomerRegistrationSerializer, CustomerListSerializer, CustomerSerializer
from django.core.cache import cache


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
        List all customers with caching.
        """
        cache_key = 'customers_list'
        customers_data = cache.get(cache_key)  # Try fetching from cache
        if not customers_data:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            customers_data = serializer.data
            cache.set(cache_key, customers_data, timeout=3600)  # Cache for 1 hour
        return Response(customers_data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single customer by ID with caching.
        """
        customer_id = kwargs.get('pk')
        cache_key = f'customer_{customer_id}'
        customer_data = cache.get(cache_key)  # Try fetching from cache
        if not customer_data:
            customer = get_object_or_404(Customer, pk=customer_id)
            serializer = self.get_serializer(customer)
            customer_data = serializer.data
            cache.set(cache_key, customer_data, timeout=3600)  # Cache for 1 hour
        return Response(customer_data, status=status.HTTP_200_OK)

    # Optional: Clear cache after update or delete
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        cache_key = f'customer_{kwargs.get("pk")}'
        cache.delete(cache_key)
        cache.delete('customers_list')  # Clear the list cache
        return response

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        cache_key = f'customer_{kwargs.get("pk")}'
        cache.delete(cache_key)
        cache.delete('customers_list')  # Clear the list cache
        return response

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
