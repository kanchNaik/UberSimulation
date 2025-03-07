from rest_framework import serializers
from .models import Ride, Location, RideEventImage, Review, RideRequest


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['latitude', 'longitude']

class RideSerializer(serializers.ModelSerializer):
    pickup_location = LocationSerializer(required=False)
    dropoff_location = LocationSerializer(required=False)

    # Adding new fields for pickup and dropoff times
    pickup_time = serializers.TimeField(required=False)
    dropoff_time = serializers.TimeField(required=False)

    class Meta:
        model = Ride
        fields = ['ride_id', 'pickup_location', 'dropoff_location', 'date_time', 'pickup_time', 'dropoff_time', 'customer', 'driver']
        read_only_fields = ['ride_id']

    def create(self, validated_data):
        # Handle nested location data
        pickup_location_data = validated_data.pop('pickup_location', None)
        dropoff_location_data = validated_data.pop('dropoff_location', None)

        # Create Location instances if data is provided
        pickup_location = Location.objects.create(**pickup_location_data) if pickup_location_data else None
        dropoff_location = Location.objects.create(**dropoff_location_data) if dropoff_location_data else None

        # Create Ride instance
        ride = Ride.objects.create(
            pickup_location=pickup_location,
            dropoff_location=dropoff_location,
            **validated_data
        )
        return ride

    def update(self, instance, validated_data):
        # Handle nested location data
        pickup_data = validated_data.pop('pickup_location', None)
        dropoff_data = validated_data.pop('dropoff_location', None)

        if pickup_data:
            for attr, value in pickup_data.items():
                setattr(instance.pickup_location, attr, value)
            instance.pickup_location.save()

        if dropoff_data:
            for attr, value in dropoff_data.items():
                setattr(instance.dropoff_location, attr, value)
            instance.dropoff_location.save()

        # Update the pickup_time and dropoff_time fields if provided
        pickup_time = validated_data.pop('pickup_time', None)
        dropoff_time = validated_data.pop('dropoff_time', None)

        if pickup_time:
            instance.pickup_time = pickup_time
        if dropoff_time:
            instance.dropoff_time = dropoff_time

        # Update remaining fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class RideEventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RideEventImage
        fields = ['id', 'customer', 'ride', 'image', 'description', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

    def create(self, validated_data):
        return RideEventImage.objects.create(**validated_data)


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ["id", "customer", "driver", "ride", "review_text", "rating", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate(self, data):
        """
        Ensure a valid rating and a target (driver or ride) is provided.
        """
        if not data.get("driver") and not data.get("ride"):
            raise serializers.ValidationError("You must specify either a driver or a ride to review.")

        if data.get("driver") and data.get("ride"):
            raise serializers.ValidationError("You can only review either a driver or a ride, not both.")

        if not (1 <= data["rating"] <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")

        return data

class RideRequestSerializer(serializers.ModelSerializer):
    pickup_location = serializers.DictField(write_only=True)
    dropoff_location = serializers.DictField(write_only=True)

    class Meta:
        model = RideRequest
        fields = [
            'pickup_location', 'dropoff_location',
            'date_time', 'pickup_time', 'dropoff_time',
            'customer', 'driver'
        ]

    def create(self, validated_data):
        pickup_location = validated_data.pop('pickup_location')
        dropoff_location = validated_data.pop('dropoff_location')

        ride_request = RideRequest.objects.create(
            pickup_latitude=pickup_location['latitude'],
            pickup_longitude=pickup_location['longitude'],
            dropoff_latitude=dropoff_location['latitude'],
            dropoff_longitude=dropoff_location['longitude'],
            **validated_data
        )
        return ride_request

