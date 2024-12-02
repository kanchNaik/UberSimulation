# Generated by Django 5.1.1 on 2024-11-30 10:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Billing', '0001_initial'),
        ('customer', '0001_initial'),
        ('driver', '0001_initial'),
        ('rides', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='bill',
            name='customer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='customer.customer'),
        ),
        migrations.AddField(
            model_name='bill',
            name='driver',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='driver.driver'),
        ),
        migrations.AddField(
            model_name='bill',
            name='ride',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='billing', to='rides.ride'),
        ),
    ]