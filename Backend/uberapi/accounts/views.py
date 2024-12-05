from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from accounts.models import User
from accounts.serializers import LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from datetime import timedelta

class LoginViewSet(viewsets.ViewSet):
    """
    API for logging in a user and returning a JWT token.
    """
    permission_classes = [AllowAny]
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """
        Handle user login and return a JWT token.
        """
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            # Authenticate the user
            user = authenticate(username=username, password=password)
            if not user:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh.set_exp(lifetime=timedelta(days=7))

            userid=""
            if user.is_customer:
                userid = user.customer_profile.id
            elif user.is_driver:
                userid = user.driver_profile.id

            return Response({
                "refresh": str(refresh),
                "access": access_token,
                "user": {
                    "id": user.id,
                    "user_id": userid,
                    "username": user.username,
                    "email": user.email,
                    "is_customer": user.is_customer,
                    "is_driver": user.is_driver,
                    "name": user.first_name
                }
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
