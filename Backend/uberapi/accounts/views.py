from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import User
from customer.models import Customer
from customer.serializers import CustomerRegistrationSerializer

class CustomerRegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data.pop('user')  # Extract user data
            user = User.objects.create_user(
                username=user_data['username'],
                password=user_data['password'],
                is_customer=True,
            )

            # Create Customer instance linked to the user
            Customer.objects.create(user=user, **serializer.validated_data)

            return Response(
                {"message": "Customer signed up successfully!", "user_id": user.id},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
