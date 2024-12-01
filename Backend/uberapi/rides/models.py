from django.db import models
from django.core.cache import cache
from driver.models import Driver
from customer.models import Customer
import random

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"Lat: {self.latitude}, Lon: {self.longitude}"

class Ride(models.Model):
    ride_id = models.CharField(max_length=11, primary_key=True, editable=False, unique=True)
    pickup_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='pickup_rides')
    dropoff_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='dropoff_rides')
    date_time = models.DateTimeField()
    pickup_time = models.TimeField()
    dropoff_time = models.TimeField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='rides')
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='rides')

    def save(self, *args, **kwargs):
        if not self.ride_id:
            self.ride_id = self.generate_ride_id()
        super().save(*args, **kwargs)
        self.clear_cache()

    def delete(self, *args, **kwargs):
        self.clear_cache()
        super().delete(*args, **kwargs)

    def clear_cache(self):
        """
        Clear the cache for this ride and the rides list.
        """
        cache.delete(f'ride_{self.ride_id}')  # Clear individual ride cache
        cache.delete('rides_list')  # Clear rides list cache

    @staticmethod
    def generate_ride_id():
        """
        Generate a unique ride ID in SSN format: XXX-XX-XXXX
        """
        while True:
            ride_id = f"{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(1000, 9999)}"
            if not Ride.objects.filter(ride_id=ride_id).exists():
                return ride_id
