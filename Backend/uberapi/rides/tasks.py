from celery import shared_task
from django.contrib.gis.geos import Point
from django.db import transaction
from .models import RideRequest, Driver, Ride
from kafka import KafkaProducer
import json


@shared_task
def process_ride_request(ride_request_id):
    try:
        with transaction.atomic():
            # Fetch ride request
            ride_request = RideRequest.objects.get(id=ride_request_id)

            # Find available driver
            pickup_point = Point(
                ride_request.pickup_longitude,
                ride_request.pickup_latitude
            )

            available_driver = Driver.objects.filter(
                is_available=True,
                current_location__distance_lte=(pickup_point, 0.1)  # 10km radius
            ).first()

            if not available_driver:
                ride_request.status = 'NO_DRIVER_AVAILABLE'
                ride_request.save()
                return

            # Create ride
            ride = Ride.objects.create(
                ride_request=ride_request,
                driver=available_driver
            )

            # Update driver and ride request status
            available_driver.is_available = False
            available_driver.save()

            ride_request.driver_id = available_driver.driver_id
            ride_request.status = 'ASSIGNED'
            ride_request.save()

            # Publish to Kafka
            producer = KafkaProducer(
                bootstrap_servers=['localhost:9092'],
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )

            ride_data = {
                'ride_id': ride.id,
                'ride_request_id': ride_request.id,
                'driver_id': available_driver.driver_id,
                'status': 'ASSIGNED'
            }

            producer.send('ride_assignments', ride_data)
            producer.flush()

    except Exception as e:
        # Log error
        print(f"Ride processing error: {e}")