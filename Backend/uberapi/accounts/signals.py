from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User
from customer.models import Customer

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.is_customer:
            Customer.objects.create(user=instance)