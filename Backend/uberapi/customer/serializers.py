from rest_framework import serializers
from customer.models import Customer
from accounts.models import User

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
            'name',
            'profile_image',
            'address',
            'city',
            'state',
            'zip_code',
            'phone_number',
            'credit_card',
            'rating',
        ]

    def validate(self, data):
        """
        Ensure password is mandatory during creation.
        """
        if self.instance is None and not data.get('password'):
            raise serializers.ValidationError({"password": "This field is required."})
        return data

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

    class Meta:
        model = Customer
        fields = [
            'id', 'username', 'name', 'profile_image', 'address', 'city', 'state',
            'zip_code', 'phone_number', 'email', 'credit_card', 'rating'
        ]
