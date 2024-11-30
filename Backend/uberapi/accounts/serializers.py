from rest_framework import serializers
from accounts.models import User

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class SignInSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def create(self, validated_data):
        # Add logic to create and authenticate the user
        username = validated_data['username']
        password = validated_data['password']
        
        # You might want to check the credentials here
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            return user
        else:
            raise serializers.ValidationError("Invalid credentials")

