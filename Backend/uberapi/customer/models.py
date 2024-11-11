from django.db import models
from accounts.models import User

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    address = models.TextField(blank=True, null=True)  # Use TextField for detailed addresses
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    credit_card = models.CharField(max_length=19)
    rating = models.FloatField(null=True, blank=True)  # Default rating
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username