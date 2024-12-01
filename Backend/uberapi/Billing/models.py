from django.db import models
from django.core.cache import cache
from driver.models import Driver
from customer.models import Customer
from rides.models import Ride
import random

class Bill(models.Model):
    bill_id = models.CharField(max_length=20, primary_key=True, editable=False, unique=True)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    ride = models.ForeignKey(Ride, on_delete=models.CASCADE, related_name='billing')
    date = models.DateField()
    distance = models.FloatField()
    amount = models.FloatField()
    status = models.CharField(
        max_length=20,
        choices=[('paid', 'Paid'), ('unpaid', 'Unpaid')]
    )

    class Meta:
        verbose_name = "Bill"
        verbose_name_plural = "Bills"

    def __str__(self):
        return f"Bill {self.bill_id} - Ride {self.ride.ride_id}"

    def save(self, *args, **kwargs):
        """
        Override save method to generate a unique bill ID and clear cache.
        """
        if not self.bill_id:
            self.bill_id = self.generate_billing_id()
        super().save(*args, **kwargs)
        self.clear_cache()

    def delete(self, *args, **kwargs):
        """
        Override delete method to clear cache before deletion.
        """
        self.clear_cache()
        super().delete(*args, **kwargs)

    def clear_cache(self):
        """
        Clear the cache for this bill and the bill list.
        """
        cache.delete(f'bill_{self.bill_id}')  # Clear individual bill cache
        cache.delete('bills_list')  # Clear the list cache

    @staticmethod
    def generate_billing_id():
        """
        Generate a unique billing ID in a format: XXX-XX-XXXX.
        """
        while True:
            bill_id = f"{random.randint(100, 999)}-{random.randint(10, 99)}-{random.randint(1000, 9999)}"
            if not Bill.objects.filter(bill_id=bill_id).exists():
                return bill_id
