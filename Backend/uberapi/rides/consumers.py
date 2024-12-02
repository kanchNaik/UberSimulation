import os
import django
import json
from ConfluentKafka import Consumer, KafkaException
from confluent_kafka import KafkaError

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'rideshare.settings')
django.setup()

from rides.models import Ride, RideRequest


def process_ride_assignment(ride_data):
    try:
        ride = Ride.objects.get(id=ride_data['ride_id'])
        ride_request = RideRequest.objects.get(id=ride_data['ride_request_id'])

        # Additional processing logic can be added here
        print(f"Ride {ride.id} assigned to driver {ride_data['driver_id']}")

    except Exception as e:
        print(f"Error processing ride assignment: {e}")


class RideAssignmentConsumer:
    def __init__(self, bootstrap_servers=['localhost:9092'], topic='ride_assignments'):
        conf = {
            'bootstrap.servers': bootstrap_servers,  # Replace with your broker address
            'group.id': 'ride_assignment_group',  # Consumer group ID
            'auto.offset.reset': 'earliest'  # Start reading at the earliest message
        }
        self.consumer = Consumer(conf)
        self.consumer.subscribe([topic])

        try:
            while True:
                # Poll for new messages
                msg = self.consumer.poll(1.0)  # Timeout after 1 second

                if msg is None:
                    continue  # No message available, continue polling

                if msg.error():
                    if msg.error().code() == KafkaError._PARTITION_EOF:
                        # End of partition event
                        print('End of partition event')
                    else:
                        print(f"Consumer error: {msg.error()}")
                    continue
                ride_data = json.loads(msg.value().decode('utf-8'))
                process_ride_assignment(ride_data)
                # Process the message (assuming it's a string)
                print(f'Received message: {msg.value().decode("utf-8")}')

        except KeyboardInterrupt:
            pass

        finally:
            self.consumer.close()
            print('Consumer closed')


def run_consumer():
    consumer = RideAssignmentConsumer()


if __name__ == '__main__':
    run_consumer()