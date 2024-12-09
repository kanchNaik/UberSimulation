import random
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class Customer(models.Model):
    # Override default id field with a custom auto-generated SSN-format field
    id = models.CharField(max_length=11, primary_key=True, editable=False, unique=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='customer_profile')
    profile_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    #email = models.EmailField(unique=True)
    credit_card = models.CharField(max_length=19)
    rating = models.FloatField(null=True, blank=True)
    first_name = models.CharField(max_length=100, db_index=True)
    last_name = models.CharField(max_length=100, db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    locationName = models.CharField(max_length=100, null=True, blank=True)
    locationCity = models.CharField(max_length=100, null=True, blank=True)


    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.generate_ssn_id()
        super().save(*args, **kwargs)

    @staticmethod
    def generate_ssn_id():
        """
        Generate a random, unique ID in SSN format: XXX-XX-XXXX
        """
        while True:
            ssn = f"{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(1000, 9999)}"
            if not Customer.objects.filter(id=ssn).exists():
                return ssn

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.id})"
    

# class Review(models.Model):
#     customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='reviews')
#     review_text = models.TextField()
#     rating = models.IntegerField()  # Rating value, e.g., 1-5
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"Review by {self.customer.first_name} {self.customer.last_name} - Rating: {self.rating}"

class PaymentMethod(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='payment_methods')
    card_number = models.CharField(max_length=19)  # Format: XXXX-XXXX-XXXX-XXXX
    card_holder_name = models.CharField(max_length=100)
    expiration_date = models.CharField(max_length=5)  # Format: MM/YY
    card_type = models.CharField(max_length=20)  # e.g., Visa, MasterCard, etc.
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.card_type} **** {self.card_number[-4:]} - {self.customer.first_name}"
    
    def save(self, *args, **kwargs):
        # If this is marked as default, remove default status from other cards
        if self.is_default:
            PaymentMethod.objects.filter(customer=self.customer, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)



