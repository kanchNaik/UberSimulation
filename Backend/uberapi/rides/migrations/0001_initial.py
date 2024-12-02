# Generated by Django 5.1.1 on 2024-11-30 10:15

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('customer', '0001_initial'),
        ('driver', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('latitude', models.FloatField()),
                ('longitude', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='Ride',
            fields=[
                ('ride_id', models.CharField(editable=False, max_length=11, primary_key=True, serialize=False, unique=True)),
                ('date_time', models.DateTimeField()),
                ('pickup_time', models.TimeField()),
                ('dropoff_time', models.TimeField()),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rides', to='customer.customer')),
                ('driver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rides', to='driver.driver')),
                ('dropoff_location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='dropoff_rides', to='rides.location')),
                ('pickup_location', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pickup_rides', to='rides.location')),
            ],
            options={
                'verbose_name': 'Ride',
                'verbose_name_plural': 'Rides',
            },
        ),
        migrations.CreateModel(
            name='RideEventImage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='ride_event_images/')),
                ('description', models.TextField(blank=True, null=True)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ride_event_images', to='customer.customer')),
                ('ride', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ride_event_images', to='rides.ride')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('review_text', models.TextField()),
                ('rating', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='customer.customer')),
                ('driver', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='driver.driver')),
                ('ride', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='rides.ride')),
            ],
            options={
                'unique_together': {('customer', 'driver', 'ride')},
            },
        ),
    ]