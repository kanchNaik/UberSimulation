from rest_framework import serializers
from customer.models import Customer
from accounts.models import User

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class CustomerLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['latitude', 'longitude', 'locationName', 'locationCity']

class CustomerRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False)  # Dynamically validated in `validate`

    class Meta:
        model = Customer
        fields = [
            'username',
            'email',
            'password',
            'first_name',
            'last_name',
            'profile_image',
            'address',
            'city',
            'state',
            'zip_code',
            'phone_number',
            'credit_card',
            'rating',
            'latitude',
            'longitude',
            'locationName',
            'locationCity',
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
        Check if the email is already in use by another user.
        """
        if self.instance:
            # If updating, skip the validation if the email is the same as the current user's email
            if value != self.instance.user.email and User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already in use.")
        else:
            # If creating a new user, check for uniqueness
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        """
        Check if the username is already in use by another user.
        """
        if self.instance:
            # If updating, skip the validation if the username is the same as the current user's username
            if value != self.instance.user.username and User.objects.filter(username=value).exists():
                raise serializers.ValidationError("This username is already in use.")
        else:
            # If creating a new user, check for uniqueness
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
        user.is_customer = True
        if password:
            user.set_password(password)
        user.save()

        # Create customer profile
        customer = Customer.objects.create(user=user, **validated_data)
        return customer

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

        # Update customer profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

class CustomerListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = Customer
        fields = [
            'id', 'username', 'first_name', 'last_name', 'profile_image', 'address', 'city', 'state',
            'zip_code', 'phone_number', 'email', 'credit_card', 'rating', 'latitude', 'longitude', 'locationName', 'locationCity'
        ]

# API for Creating Customer
class CreateCustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        exclude = ['id']  # ID is auto-generated

    def create(self, validated_data):
        return Customer.objects.create(**validated_data)
