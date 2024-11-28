from django.db import models
from driver.models import Driver
from customer.models import Customer
import random

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return f"Lat: {self.latitude}, Lon: {self.longitude}"
    
class Ride(models.Model):
    # Ride ID with SSN format
    ride_id = models.CharField(max_length=11, primary_key=True, editable=False, unique=True)

    # Foreign keys to Location for pickup and drop-off
    pickup_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='pickup_rides')
    dropoff_location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='dropoff_rides')

    # Date and time of the ride
    date_time = models.DateTimeField()

    # Foreign keys to Customer and Driver
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='rides')
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='rides')

    def __str__(self):
        return f"Ride {self.ride_id} - Customer {self.customer.id}, Driver {self.driver.id}"

    class Meta:
        verbose_name = "Ride"
        verbose_name_plural = "Rides"

    def save(self, *args, **kwargs):
        if not self.ride_id:
            self.ride_id = self.generate_ride_id()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_ride_id():
        """
        Generate a unique ride ID in SSN format: XXX-XX-XXXX
        """
        while True:
            ride_id = f"{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(1000, 9999)}"
            if not Ride.objects.filter(ride_id=ride_id).exists():
                return ride_id
