from rest_framework import serializers
from .models import Bill

class BillSerializer(serializers.ModelSerializer):
    """
    Serializer for the Bill model.
    Handles partial updates and follows the structure of the RideSerializer.
    """

    class Meta:
        model = Bill
        fields = [
            'bill_id',
            'driver',
            'customer',
            'ride',
            'date',
            'distance',
            'amount',
            'status'
        ]
        read_only_fields = ['bill_id']  # Prevent updates to the bill_id

    def validate(self, attrs):
        """
        Ensure at least one field is provided for a partial update.
        """
        if self.instance and not attrs:  # Check if this is a partial update with no fields provided
            raise serializers.ValidationError(
                "At least one field must be provided for a partial update."
            )
        return attrs

    def update(self, instance, validated_data):
        """
        Override update method to handle partial and full updates.
        """
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
