import random
from django.db import models
from accounts.models import User
from django.conf import settings

class Administrator(models.Model):
    # Override default id field with a custom auto-generated SSN-format field
    id = models.CharField(max_length=11, primary_key=True, editable=False, unique=True, db_index=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='administrator_profile')
    profile_image = models.ImageField(upload_to='admin_profile_images/', blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=15)
    department = models.CharField(max_length=100, blank=True, null=True)  # Department or role of the administrator
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

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
            if not Administrator.objects.filter(id=ssn).exists():
                return ssn

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.id})"
