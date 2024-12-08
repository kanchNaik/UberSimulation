from django.core.management.base import BaseCommand
from kafka import KafkaProducer
import json
import time
import random

class Command(BaseCommand):
    help = 'Simulates driver location updates'

    def handle(self, *args, **options):
        producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )

        # Sample driver IDs
        drivers = [
            {"id": 1, "vehicle_type": "sedan"},
            {"id": 2, "vehicle_type": "suv"},
            {"id": 3, "vehicle_type": "luxury"}
        ]

        # Base coordinates (San Jose area)
        base_lat, base_lng = 37.3352, -121.8811

        try:
            while True:
                for driver in drivers:
                    # Simulate movement within ~5km radius
                    lat = base_lat + random.uniform(-0.05, 0.05)
                    lng = base_lng + random.uniform(-0.05, 0.05)

                    message = {
                        "driver_id": driver["id"],
                        "vehicle_type": driver["vehicle_type"],
                        "latitude": lat,
                        "longitude": lng,
                        "timestamp": int(time.time())
                    }

                    producer.send('available-drivers', message)
                    self.stdout.write(f"Sent driver update: {message}")

                time.sleep(5)  # Update every 5 seconds

        except KeyboardInterrupt:
            producer.close() 