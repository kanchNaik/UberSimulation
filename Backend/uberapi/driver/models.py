from django.db import models
from django.conf import settings

class Vehicle(models.Model):
    id = models.AutoField(primary_key=True)  # Auto-generated primary key
    make = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    license_plate = models.CharField(max_length=15, unique=False)

    def __str__(self):
        return f"{self.make} {self.model} ({self.id})"

class Driver(models.Model):
    id = models.CharField(max_length=11, primary_key=True, editable=False, unique=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='driver_profile')
    first_name = models.CharField(max_length=100, db_index=True)
    last_name = models.CharField(max_length=100, db_index=True)
    phone_number = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    license_number = models.CharField(max_length=15, unique=False)
    profile_image = models.ImageField(upload_to='driver_profiles/', blank=True, null=True)
    introduction_video = models.FileField(upload_to='driver_videos/', blank=True, null=True)
    vehicle = models.OneToOneField(Vehicle, on_delete=models.CASCADE, related_name='driver', null=True, blank=True)
    rating = models.FloatField(null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_available = models.BooleanField(default=True)
    locationName = models.CharField(max_length=100, null=True, blank=True)
    locationCity = models.CharField(max_length=100, null=True, blank=True)


    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_unique_id()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_unique_id():
        import random
        while True:
            unique_id = f"{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(1000, 9999)}"
            if not Driver.objects.filter(id=unique_id).exists():
                return unique_id

    def __str__(self):
        return f"{self.user.username} ({self.id})"
