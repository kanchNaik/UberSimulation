from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from accounts.models import User
from accounts.serializers import LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class LoginViewSet(viewsets.ViewSet):
    """
    API for logging in a user and returning a JWT token.
    """

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

            return Response({
                "refresh": str(refresh),
                "access": access_token,
                "user_id": user.id,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
