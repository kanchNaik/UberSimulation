from rest_framework import serializers
from .models import Ride, Location

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['latitude', 'longitude']

class RideSerializer(serializers.ModelSerializer):
    pickup_location = LocationSerializer(required=False)
    dropoff_location = LocationSerializer(required=False)

    class Meta:
        model = Ride
        fields = ['ride_id', 'pickup_location', 'dropoff_location', 'date_time', 'customer', 'driver']
        read_only_fields = ['ride_id']

    def create(self, validated_data):
        # Handle nested location data
        pickup_location_data = validated_data.pop('pickup_location')
        dropoff_location_data = validated_data.pop('dropoff_location')

        # Create Location instances
        pickup_location = Location.objects.create(**pickup_location_data)
        dropoff_location = Location.objects.create(**dropoff_location_data)

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

        # Update remaining fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
