from django.db import models
from driver.models import Driver
from customer.models import Customer
import random
from django.conf import settings

class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    locationName = models.CharField(max_length=100)
    locationCity = models.CharField(max_length=100)

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
    
    # Specific times for pickup and dropoff
    pickup_time = models.DateTimeField()
    dropoff_time = models.DateTimeField()

    
    # Foreign keys to Customer and Driver
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='rides')
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name='rides')
    fare = models.FloatField()
    distance = models.FloatField()
    status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('completed', 'Completed'), ('cancelled', 'Cancelled')]
    )

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


class RideEventImage(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='ride_event_images')
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name='ride_event_images')
    image = models.ImageField(upload_to='ride_event_images/')
    description = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Event Image for Ride {self.ride.id} - Customer {self.customer.first_name} {self.customer.last_name}"



class Review(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="reviews")
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="reviews", null=True, blank=True)
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name="reviews", null=True, blank=True)
    review_text = models.TextField()
    rating = models.IntegerField()  # Rating value, e.g., 1-5
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("customer", "driver", "ride")  # Prevent duplicate reviews for the same driver/ride

    def __str__(self):
        target = self.driver or self.ride
        return f"Review by {self.customer.username} for {target} - Rating: {self.rating}"