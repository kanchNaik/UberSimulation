from rest_framework import serializers
from accounts.models import User
from .models import Administrator

class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrator
        fields = '__all__'

class AdministratorRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False)  # Password will be validated in `validate`

    class Meta:
        model = Administrator
        fields = [
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'city',
            'state',
            'zip_code',
            'profile_image',
        ]

    def validate(self, data):
        """
        Ensure password is mandatory during creation.
        """
        if self.instance is None and not data.get('password'):
            raise serializers.ValidationError({"password": "This field is required."})
        return data

    def validate_email(self, value):
        """
        Check if the email is already in use by another user, excluding the current user's email.
        """
        if self.instance:
            if value != self.instance.user.email and User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already in use.")
        else:
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        """
        Check if the username is already in use by another user, excluding the current user's username.
        """
        if self.instance:
            if value != self.instance.user.username and User.objects.filter(username=value).exists():
                raise serializers.ValidationError("This username is already in use.")
        else:
            if User.objects.filter(username=value).exists():
                raise serializers.ValidationError("This username is already in use.")
        return value

    def create(self, validated_data):
        # Extract user-related fields
        username = validated_data.pop('username')
        email = validated_data.pop('email')
        password = validated_data.pop('password', None)

        # Create user
        user = User.objects.create(username=username, email=email)
        if password:
            user.set_password(password)
        user.save()

        # Create administrator profile
        administrator = Administrator.objects.create(user=user, **validated_data)
        return administrator

    def update(self, instance, validated_data):
        # Extract user-related fields
        username = validated_data.pop('username', None)
        email = validated_data.pop('email', None)
        password = validated_data.pop('password', None)

        # Update user
        user = instance.user
        if username:
            user.username = username
        if email:
            user.email = email
        if password:
            user.set_password(password)
        user.save()

        # Update administrator profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class AdministratorListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Administrator
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'address', 'city', 'state',
            'zip_code', 'profile_image'
        ]
