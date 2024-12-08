from rest_framework import serializers
from driver.models import Driver, Vehicle
from accounts.models import User

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class DriverLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['latitude', 'longitude', 'locationName', 'locationCity']

class DriverRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=False)  # Dynamically validated in `validate`
    vehicle = VehicleSerializer(required=False)  # Nested serializer for vehicle

    class Meta:
        model = Driver
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
            'license_number',
            'profile_image',
            'introduction_video',
            'vehicle'
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
            # Skip validation if the email belongs to the current user
            if value != self.instance.user.email and User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already in use.")
        else:
            # If creating a new user, check for uniqueness
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        """
        Check if the username is already in use by another user, excluding the current user's username.
        """
        if self.instance:
            # Skip validation if the username belongs to the current user
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
        vehicle_data = validated_data.pop('vehicle', None)

        # Create user
        user = User.objects.create(username=username, email=email)
        user.is_driver = True
        if password:
            user.set_password(password)
        user.save()

        # Create vehicle if provided
        vehicle = None
        if vehicle_data:
            vehicle_serializer = VehicleSerializer(data=vehicle_data)
            if vehicle_serializer.is_valid():
                vehicle = vehicle_serializer.save()
            else:
                raise serializers.ValidationError(vehicle_serializer.errors)

        # Create driver profile
        driver = Driver.objects.create(user=user, vehicle=vehicle, **validated_data)
        return driver

    def update(self, instance, validated_data):
        # Extract user-related fields
        username = validated_data.pop('username', None)
        email = validated_data.pop('email', None)
        password = validated_data.pop('password', None)
        vehicle_data = validated_data.pop('vehicle', None)

        # Update user
        user = instance.user
        if username:
            user.username = username
        if email:
            user.email = email
        if password:
            user.set_password(password)
        user.save()

        # Update vehicle if provided
        if vehicle_data:
            if instance.vehicle:
                # Update existing vehicle
                for attr, value in vehicle_data.items():
                    setattr(instance.vehicle, attr, value)
                instance.vehicle.save()
            else:
                # Create new vehicle
                instance.vehicle = Vehicle.objects.create(**vehicle_data)

        # Update driver profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class DriverListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    vehicle = VehicleSerializer(read_only=True)

    class Meta:
        model = Driver
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'address', 'city', 'state',
            'zip_code', 'license_number', 'profile_image', 'introduction_video', 'vehicle', 'rating', 'latitude', 'longitude', 'locationName', 'locationCity',
            'is_available'
        ]


# API for Creating Driver
class CreateDriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        exclude = ['id']  # ID is auto-generated

    def create(self, validated_data):
        return Driver.objects.create(**validated_data)
    
class NearbyDriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['id', 'first_name', 'last_name', 'latitude', 'longitude', 'phone_number', 'license_number', 'profile_image', 'vehicle', 'rating', 'locationName', 'locationCity']


class DriverIntroVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['introduction_video']