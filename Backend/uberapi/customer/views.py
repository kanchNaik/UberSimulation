from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from customer.models import Customer
from django.shortcuts import get_object_or_404
from customer.serializers import CustomerRegistrationSerializer, CustomerListSerializer

class CustomerView(APIView):

    def get(self, request, *args, **kwargs):
        """
        Handles listing all customers or retrieving a specific customer by ID.
        """
        customer_id = kwargs.get('id')
        print(kwargs)
        if customer_id:  # If `id` is provided, fetch the specific customer
            customer = get_object_or_404(Customer, id=customer_id)
            serializer = CustomerListSerializer(customer)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # If no `id` is provided, list all customers
        customers = Customer.objects.all()
        serializer = CustomerListSerializer(customers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """
        Handles customer registration.
        """
        serializer = CustomerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            customer = serializer.save()
            return Response(
                {"message": "Customer registered successfully!", "user_id": customer.user.id},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, *args, **kwargs):
        """
        Handle both full (PUT) and partial (PATCH) updates.
        """
        customer_id = kwargs.get('id')
        if not customer_id:
            return Response(
                {"error": "Customer ID is required for updating."},
                status=status.HTTP_400_BAD_REQUEST
            )

        customer = get_object_or_404(Customer, id=customer_id)

        # Determine whether this is a full or partial update
        partial = request.method == "PATCH"
        serializer = CustomerRegistrationSerializer(customer, data=request.data, partial=partial)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Customer updated successfully!"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    patch = put # Alias `patch` to use the same logic as `put`


    def delete(self, request, id, *args, **kwargs):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

        customer.user.delete()  # Deletes the related User as well
        customer.delete()
        return Response({"message": "Customer deleted successfully!"}, status=status.HTTP_200_OK)